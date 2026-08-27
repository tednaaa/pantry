import type { CategoryId, Unit } from '@/shared/lib';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  unit?: Unit;
  note?: string;
  photo?: string;
  frequent?: boolean;
  archived?: boolean;
}
