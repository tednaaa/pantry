import type { Check, CustomProduct, PlanItem } from './types';
import { isCategoryId, isUnit } from '@/shared/lib';
import { db } from './database';

export const BACKUP_VERSION = 1;

export interface Backup {
  version: number;
  exportedAt: string;
  plan: PlanItem[];
  checks: Check[];
  customProducts: CustomProduct[];
}

export type BackupMode = 'replace' | 'merge';

export type BackupCheck
  = | { ok: true; backup: Backup }
    | { ok: false; reason: string };

function isPlanItem(value: unknown): value is PlanItem {
  const item = value as PlanItem | null;

  return typeof item?.id === 'string'
    && (item.kind === 'dish' || item.kind === 'product')
    && typeof item.refId === 'string'
    && typeof item.qty === 'number'
    && typeof item.addedAt === 'number';
}

function isCheck(value: unknown): value is Check {
  const check = value as Check | null;

  return typeof check?.key === 'string' && typeof check.checkedAt === 'number';
}

function isCustomProduct(value: unknown): value is CustomProduct {
  const product = value as CustomProduct | null;

  return typeof product?.id === 'string'
    && typeof product.name === 'string'
    && isCategoryId(product.category)
    && (product.unit === undefined || isUnit(product.unit))
    && (product.note === undefined || typeof product.note === 'string')
    && typeof product.createdAt === 'number'
    && typeof product.updatedAt === 'number';
}

export function backupFileName(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `pantry-${year}-${month}-${day}.json`;
}

export function describeBackup(backup: Backup): string {
  return [
    `позиций плана: ${backup.plan.length}`,
    `своих продуктов: ${backup.customProducts.length}`,
    `отмечено купленным: ${backup.checks.length}`,
  ].join(', ');
}

export function readBackup(raw: string): BackupCheck {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  }
  catch {
    return { ok: false, reason: 'Файл не похож на JSON' };
  }

  const candidate = parsed as Partial<Backup> | null;

  if (candidate?.version !== BACKUP_VERSION) {
    return { ok: false, reason: 'Незнакомый формат копии' };
  }
  if (!Array.isArray(candidate.plan) || !candidate.plan.every(isPlanItem)) {
    return { ok: false, reason: 'План в файле повреждён' };
  }
  if (!Array.isArray(candidate.customProducts) || !candidate.customProducts.every(isCustomProduct)) {
    return { ok: false, reason: 'Свои продукты в файле повреждены' };
  }

  const checks = candidate.checks ?? [];

  if (!Array.isArray(checks) || !checks.every(isCheck)) {
    return { ok: false, reason: 'Отметки о покупках в файле повреждены' };
  }

  return {
    ok: true,
    backup: {
      version: BACKUP_VERSION,
      exportedAt: typeof candidate.exportedAt === 'string' ? candidate.exportedAt : '',
      plan: candidate.plan,
      checks,
      customProducts: candidate.customProducts,
    },
  };
}

export async function collectBackup(): Promise<Backup> {
  const [plan, checks, customProducts] = await Promise.all([
    db.plan.toArray(),
    db.checks.toArray(),
    db.customProducts.toArray(),
  ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    plan,
    checks,
    customProducts,
  };
}

export async function applyBackup(backup: Backup, mode: BackupMode): Promise<void> {
  await db.transaction('rw', db.plan, db.checks, db.customProducts, async () => {
    if (mode === 'replace') {
      await Promise.all([db.plan.clear(), db.checks.clear(), db.customProducts.clear()]);
    }

    await db.plan.bulkPut(backup.plan);
    await db.checks.bulkPut(backup.checks);
    await db.customProducts.bulkPut(backup.customProducts);
  });
}

export async function wipeAllData(): Promise<void> {
  await db.transaction('rw', db.plan, db.checks, db.customProducts, async () => {
    await Promise.all([db.plan.clear(), db.checks.clear(), db.customProducts.clear()]);
  });
}
