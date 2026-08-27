import type { Check, PlanItem, PlanKind } from '@/shared/db';
import { db } from '@/shared/db';
import { buildPlanItem, planKey } from './plan';

export function listPlan(): Promise<PlanItem[]> {
  return db.plan.orderBy('addedAt').toArray();
}

export function listChecks(): Promise<Check[]> {
  return db.checks.toArray();
}

export async function setQty(kind: PlanKind, refId: string, qty: number): Promise<void> {
  const key = planKey(kind, refId);

  if (qty < 1) {
    await db.plan.delete(key);

    return;
  }

  const existing = await db.plan.get(key);

  await db.plan.put(existing ? { ...existing, qty } : buildPlanItem(kind, refId, qty, Date.now()));
}

export async function setChecked(key: string, checked: boolean): Promise<void> {
  if (checked) {
    await db.checks.put({ key, checkedAt: Date.now() });
  }
  else {
    await db.checks.delete(key);
  }
}

export async function clearChecks(): Promise<void> {
  await db.checks.clear();
}

export async function clearPlan(): Promise<void> {
  await db.transaction('rw', db.plan, db.checks, async () => {
    await Promise.all([db.plan.clear(), db.checks.clear()]);
  });
}
