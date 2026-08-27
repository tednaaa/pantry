import type { Dish } from '@/entities/dish';
import type { Product } from '@/entities/product';
import type { CustomProduct, PlanItem } from '@/shared/db';
import type { CategoryId, Unit } from '@/shared/lib';
import { dishById, formatServings } from '@/entities/dish';
import { productById, toProduct } from '@/entities/product';
import { categories, categoryName, formatAmount, formatPieces } from '@/shared/lib';

export interface PlannedDish {
  dish: Dish;
  qty: number;
}

export interface PlannedProduct {
  product: Product;
  qty: number;
}

export interface ResolvedPlan {
  dishes: PlannedDish[];
  products: PlannedProduct[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  note?: string;
}

export interface ShoppingGroup {
  category: CategoryId;
  name: string;
  items: ShoppingItem[];
}

interface Total {
  id: string;
  name: string;
  category: CategoryId;
  unit?: Unit;
  note?: string;
  amount: number;
  count: number;
}

export function resolvePlan(items: PlanItem[], customProducts: CustomProduct[]): ResolvedPlan {
  const custom = new Map(customProducts.map(product => [product.id, toProduct(product)]));

  const dishes: PlannedDish[] = [];
  const products: PlannedProduct[] = [];

  for (const item of items) {
    if (item.kind === 'dish') {
      const dish = dishById(item.refId);

      if (dish) {
        dishes.push({ dish, qty: item.qty });
      }

      continue;
    }

    const product = productById(item.refId) ?? custom.get(item.refId);

    if (product) {
      products.push({ product, qty: item.qty });
    }
  }

  return { dishes, products };
}

function formatTotal({ amount, unit, count }: Total): string {
  const parts: string[] = [];

  if (amount && unit) {
    parts.push(formatAmount(amount, unit));
  }
  if (count > 1 || (count && parts.length)) {
    parts.push(formatPieces(count));
  }

  return parts.join(' + ');
}

function add(totals: Map<string, Total>, product: Product, amount: number, count: number) {
  const existing = totals.get(product.id);

  if (existing) {
    existing.amount += amount;
    existing.count += count;

    return;
  }

  totals.set(product.id, {
    id: product.id,
    name: product.name,
    category: product.category,
    unit: product.unit,
    note: product.note,
    amount,
    count,
  });
}

export function buildShoppingList({ dishes, products }: ResolvedPlan): ShoppingGroup[] {
  const totals = new Map<string, Total>();

  for (const { dish, qty } of dishes) {
    for (const ingredient of dish.ingredients) {
      const product = productById(ingredient.product);

      if (product) {
        add(totals, product, (ingredient.amount ?? 0) * qty, 0);
      }
    }
  }

  for (const { product, qty } of products) {
    add(totals, product, 0, qty);
  }

  const entries = [...totals.values()];

  return categories
    .map(({ id, name }) => ({
      category: id,
      name,
      items: entries
        .filter(total => total.category === id)
        .map(total => ({ id: total.id, name: total.name, amount: formatTotal(total), note: total.note }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    }))
    .filter(group => group.items.length > 0);
}

export function countShoppingItems(groups: ShoppingGroup[]): number {
  return groups.reduce((total, group) => total + group.items.length, 0);
}

export function countCheckedItems(groups: ShoppingGroup[], checked: Set<string>): number {
  return groups.reduce(
    (total, group) => total + group.items.filter(item => checked.has(item.id)).length,
    0,
  );
}

function formatLine({ name, amount, note }: ShoppingItem): string {
  const suffix = note ? ` (${note})` : '';

  return amount ? `- ${name} ${amount}${suffix}` : `- ${name}${suffix}`;
}

export function buildShoppingText(plan: ResolvedPlan, groups: ShoppingGroup[]): string {
  const lines: string[] = [];

  if (plan.dishes.length) {
    lines.push('Готовим:');
    lines.push(...plan.dishes.map(({ dish, qty }) => (
      `- ${dish.name} — ${formatServings(dish.servings * qty)}`
    )));
  }

  for (const group of groups) {
    if (lines.length) {
      lines.push('');
    }

    lines.push(`${categoryName(group.category)}:`);
    lines.push(...group.items.map(formatLine));
  }

  return lines.join('\n');
}
