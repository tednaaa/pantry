export const categories = [
  { id: 'vegetables', name: 'Овощи' },
  { id: 'fruits', name: 'Фрукты' },
  { id: 'greens', name: 'Зелень' },
  { id: 'dairy', name: 'Молочка' },
  { id: 'grains', name: 'Крупы' },
  { id: 'staples', name: 'Бакалея' },
  { id: 'meat', name: 'Мясная' },
  { id: 'ready', name: 'Готовое' },
  { id: 'other', name: 'Прочее' },
] as const;

export type CategoryId = typeof categories[number]['id'];

export const FALLBACK_CATEGORY: CategoryId = 'other';

const namesById = new Map<string, string>(categories.map(({ id, name }) => [id, name]));

export function categoryName(id: CategoryId): string {
  return namesById.get(id) ?? id;
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && namesById.has(value);
}
