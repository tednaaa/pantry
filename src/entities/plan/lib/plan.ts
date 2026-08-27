import type { PlanItem, PlanKind } from '@/shared/db';

export function planKey(kind: PlanKind, refId: string): string {
  return `${kind}:${refId}`;
}

export function buildPlanItem(kind: PlanKind, refId: string, qty: number, now: number): PlanItem {
  return { id: planKey(kind, refId), kind, refId, qty, addedAt: now };
}

export function increaseQty(qty: number): number {
  return qty + 1;
}

export function decreaseQty(qty: number): number {
  return qty - 1;
}

export function toggleQty(qty: number): number {
  return qty > 0 ? 0 : 1;
}

export function qtyOf(items: PlanItem[], kind: PlanKind, refId: string): number {
  const key = planKey(kind, refId);

  return items.find(item => item.id === key)?.qty ?? 0;
}

export function itemsOfKind(items: PlanItem[], kind: PlanKind): PlanItem[] {
  return items.filter(item => item.kind === kind);
}
