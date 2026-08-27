import type { ResolvedPlan } from './shopping-list';
import type { CustomProduct, PlanItem } from '@/shared/db';
import { dishById } from '@/entities/dish';
import { productById } from '@/entities/product';
import { buildShoppingList, buildShoppingText, countCheckedItems, resolvePlan } from './shopping-list';

function dish(id: string, qty: number) {
  const found = dishById(id);

  if (!found) {
    throw new Error(`Unknown dish ${id}`);
  }

  return { dish: found, qty };
}

function product(id: string, qty: number) {
  const found = productById(id);

  if (!found) {
    throw new Error(`Unknown product ${id}`);
  }

  return { product: found, qty };
}

function planItem(kind: PlanItem['kind'], refId: string, qty: number): PlanItem {
  return { id: `${kind}:${refId}`, kind, refId, qty, addedAt: 0 };
}

function customProduct(overrides: Partial<CustomProduct> = {}): CustomProduct {
  return {
    id: 'custom-foil',
    name: 'фольга',
    category: 'other',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function itemsOf(groups: ReturnType<typeof buildShoppingList>, category: string) {
  return groups.find(group => group.category === category)?.items ?? [];
}

function amountOf(groups: ReturnType<typeof buildShoppingList>, category: string, id: string) {
  return itemsOf(groups, category).find(item => item.id === id)?.amount;
}

describe('resolvePlan', () => {
  it('should resolve catalog dishes and products', () => {
    const resolved = resolvePlan([planItem('dish', 'borsch', 1), planItem('product', 'bread', 2)], []);

    expect(resolved.dishes).toHaveLength(1);
    expect(resolved.dishes[0].dish.id).toBe('borsch');
    expect(resolved.products[0].product.name).toBe('хлеб');
    expect(resolved.products[0].qty).toBe(2);
  });

  it('should resolve custom products by id', () => {
    const resolved = resolvePlan([planItem('product', 'custom-foil', 1)], [customProduct()]);

    expect(resolved.products[0].product.name).toBe('фольга');
  });

  it('should drop references that no longer exist', () => {
    const resolved = resolvePlan([planItem('dish', 'gone', 1), planItem('product', 'gone', 1)], []);

    expect(resolved.dishes).toEqual([]);
    expect(resolved.products).toEqual([]);
  });
});

describe('buildShoppingList', () => {
  it('should scale ingredient amounts by how many times the dish is cooked', () => {
    const single = buildShoppingList({ dishes: [dish('greek-salad', 1)], products: [] });
    const double = buildShoppingList({ dishes: [dish('greek-salad', 2)], products: [] });

    expect(amountOf(single, 'vegetables', 'tomato')).toBe('300 г');
    expect(amountOf(double, 'vegetables', 'tomato')).toBe('600 г');
  });

  it('should scale grams to kilograms past a thousand', () => {
    const groups = buildShoppingList({ dishes: [dish('plov', 3)], products: [] });

    expect(amountOf(groups, 'grains', 'rice')).toBe('1.5 кг');
  });

  it('should merge the same product across dishes', () => {
    const groups = buildShoppingList({ dishes: [dish('borsch', 1), dish('syrniki', 1)], products: [] });

    expect(amountOf(groups, 'dairy', 'sour-cream')).toBe('400 г');
  });

  it('should keep an amount and a piece count side by side', () => {
    const groups = buildShoppingList({ dishes: [dish('borsch', 1)], products: [product('sour-cream', 1)] });

    expect(amountOf(groups, 'dairy', 'sour-cream')).toBe('200 г + 1×');
  });

  it('should leave a single piece of an unmeasured product without an amount', () => {
    const groups = buildShoppingList({ dishes: [], products: [product('bread', 1)] });

    expect(amountOf(groups, 'staples', 'bread')).toBe('');
  });

  it('should count several pieces of an unmeasured product', () => {
    const groups = buildShoppingList({ dishes: [], products: [product('bread', 3)] });

    expect(amountOf(groups, 'staples', 'bread')).toBe('3×');
  });

  it('should carry the note of a product', () => {
    const groups = buildShoppingList({ dishes: [], products: [product('cabbage', 1)] });

    expect(itemsOf(groups, 'vegetables')[0].note).toBe('маленькая');
  });

  it('should order groups the way the shop is walked and sort items inside them', () => {
    const groups = buildShoppingList({ dishes: [dish('borsch', 1)], products: [] });

    expect(groups.map(group => group.category)).toEqual(['vegetables', 'dairy', 'staples', 'meat']);
    expect(itemsOf(groups, 'vegetables').map(item => item.name)).toEqual(['капуста', 'картофель', 'лук', 'морковь', 'свёкла']);
  });

  it('should skip empty groups', () => {
    const groups = buildShoppingList({ dishes: [], products: [product('bread', 1)] });

    expect(groups).toHaveLength(1);
  });
});

describe('buildShoppingText', () => {
  it('should list what gets cooked with its servings before the aisles', () => {
    const plan: ResolvedPlan = { dishes: [dish('syrniki', 2)], products: [] };
    const text = buildShoppingText(plan, buildShoppingList(plan));

    expect(text.split('\n')[0]).toBe('Готовим:');
    expect(text).toContain('- сырники — 8 порций');
    expect(text).toContain('Молочка:');
    expect(text).toContain('- творог 1 кг');
  });

  it('should print a note next to the product', () => {
    const plan: ResolvedPlan = { dishes: [], products: [product('cabbage', 1)] };

    expect(buildShoppingText(plan, buildShoppingList(plan))).toContain('- капуста (маленькая)');
  });

  it('should stay empty for an empty plan', () => {
    expect(buildShoppingText({ dishes: [], products: [] }, [])).toBe('');
  });
});

describe('countCheckedItems', () => {
  it('should count only the marks that are still in the list', () => {
    const groups = buildShoppingList({ dishes: [], products: [product('bread', 1), product('milk', 1)] });

    expect(countCheckedItems(groups, new Set(['bread', 'gone']))).toBe(1);
  });
});
