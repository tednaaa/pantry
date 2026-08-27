import type { Table } from 'dexie';
import type { Check, CustomProduct, PlanItem } from './types';
import Dexie from 'dexie';

export type AppDatabase = Dexie & {
  plan: Table<PlanItem, string>;
  checks: Table<Check, string>;
  customProducts: Table<CustomProduct, string>;
};

export const db = new Dexie('pantry') as AppDatabase;

db.version(1).stores({
  plan: 'id, kind, refId, addedAt',
  checks: 'key',
  customProducts: 'id, createdAt',
});
