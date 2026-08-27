import type { Product } from './types';
import type { CustomProduct } from '@/shared/db';
import type { CategoryId, Unit } from '@/shared/lib';
import { db } from '@/shared/db';

export interface CustomProductInput {
  name: string;
  category: CategoryId;
  unit?: Unit;
  note?: string;
}

export function buildCustomProduct(input: CustomProductInput, now: number): CustomProduct {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    unit: input.unit,
    note: input.note,
    createdAt: now,
    updatedAt: now,
  };
}

export function nextCustomProduct(current: CustomProduct, input: CustomProductInput, now: number): CustomProduct {
  return {
    ...current,
    name: input.name,
    category: input.category,
    unit: input.unit,
    note: input.note,
    updatedAt: now,
  };
}

export function toProduct(custom: CustomProduct): Product {
  return {
    id: custom.id,
    name: custom.name,
    category: custom.category,
    unit: custom.unit,
    note: custom.note,
  };
}

export function listCustomProducts(): Promise<CustomProduct[]> {
  return db.customProducts.orderBy('createdAt').toArray();
}

export function loadCustomProduct(id: string): Promise<CustomProduct | undefined> {
  return db.customProducts.get(id);
}

export async function createCustomProduct(input: CustomProductInput): Promise<CustomProduct> {
  const product = buildCustomProduct(input, Date.now());

  await db.customProducts.add(product);

  return product;
}

export async function saveCustomProduct(current: CustomProduct, input: CustomProductInput): Promise<void> {
  await db.customProducts.put(nextCustomProduct(current, input, Date.now()));
}

export async function removeCustomProduct(id: string): Promise<void> {
  await db.transaction('rw', db.customProducts, db.plan, async () => {
    await db.customProducts.delete(id);
    await db.plan.where('refId').equals(id).delete();
  });
}
