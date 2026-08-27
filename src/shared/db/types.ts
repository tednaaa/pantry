import type { CategoryId, Unit } from '@/shared/lib';

export type PlanKind = 'dish' | 'product';

export interface PlanItem {
  id: string;
  kind: PlanKind;
  refId: string;
  qty: number;
  addedAt: number;
}

export interface Check {
  key: string;
  checkedAt: number;
}

export interface CustomProduct {
  id: string;
  name: string;
  category: CategoryId;
  unit?: Unit;
  note?: string;
  createdAt: number;
  updatedAt: number;
}
