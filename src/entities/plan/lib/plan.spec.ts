import type { PlanItem } from '@/shared/db';
import { buildPlanItem, decreaseQty, increaseQty, itemsOfKind, planKey, qtyOf, toggleQty } from './plan';

const items: PlanItem[] = [
  { id: 'dish:borsch', kind: 'dish', refId: 'borsch', qty: 2, addedAt: 1 },
  { id: 'product:bread', kind: 'product', refId: 'bread', qty: 1, addedAt: 2 },
];

describe('planKey', () => {
  it('should keep dishes and products apart when ids collide', () => {
    expect(planKey('dish', 'bread')).not.toBe(planKey('product', 'bread'));
  });
});

describe('buildPlanItem', () => {
  it('should key the item by kind and reference', () => {
    expect(buildPlanItem('product', 'bread', 3, 42)).toEqual({
      id: 'product:bread',
      kind: 'product',
      refId: 'bread',
      qty: 3,
      addedAt: 42,
    });
  });
});

describe('qty steppers', () => {
  it('should step whole units up and down', () => {
    expect(increaseQty(0)).toBe(1);
    expect(increaseQty(2)).toBe(3);
    expect(decreaseQty(2)).toBe(1);
  });

  it('should fall to zero from one so the caller drops the item', () => {
    expect(decreaseQty(1)).toBe(0);
  });

  it('should toggle between absent and one', () => {
    expect(toggleQty(0)).toBe(1);
    expect(toggleQty(5)).toBe(0);
  });
});

describe('qtyOf', () => {
  it('should find the quantity of a planned reference', () => {
    expect(qtyOf(items, 'dish', 'borsch')).toBe(2);
  });

  it('should report zero for anything not planned', () => {
    expect(qtyOf(items, 'product', 'borsch')).toBe(0);
    expect(qtyOf(items, 'dish', 'plov')).toBe(0);
  });
});

describe('itemsOfKind', () => {
  it('should split the plan by kind', () => {
    expect(itemsOfKind(items, 'dish')).toHaveLength(1);
    expect(itemsOfKind(items, 'product')).toHaveLength(1);
  });
});
