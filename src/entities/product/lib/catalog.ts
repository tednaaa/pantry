import type { Product } from './types';

export const products = [
  { id: 'tomato', name: 'помидор', category: 'vegetables', unit: 'г', frequent: true },
  { id: 'cucumber', name: 'огурец', category: 'vegetables', unit: 'г', frequent: true },
  { id: 'carrot', name: 'морковь', category: 'vegetables', unit: 'г', frequent: true },
  { id: 'onion', name: 'лук', category: 'vegetables', unit: 'г' },
  { id: 'garlic', name: 'чеснок', category: 'vegetables', unit: 'зубчик' },
  { id: 'potato', name: 'картофель', category: 'vegetables', unit: 'г' },
  { id: 'beetroot', name: 'свёкла', category: 'vegetables', unit: 'г' },
  { id: 'cabbage', name: 'капуста', category: 'vegetables', unit: 'г', note: 'маленькая', frequent: true },

  { id: 'dill', name: 'укроп', category: 'greens', unit: 'пучок', frequent: true },
  { id: 'cilantro', name: 'кинза', category: 'greens', unit: 'пучок', frequent: true },

  { id: 'milk', name: 'молоко', category: 'dairy', unit: 'мл', frequent: true },
  { id: 'matsun', name: 'мацун', category: 'dairy', unit: 'мл' },
  { id: 'sour-cream', name: 'сметана', category: 'dairy', unit: 'г', frequent: true },
  { id: 'eggs', name: 'яйца', category: 'dairy', unit: 'шт', frequent: true },
  { id: 'curd', name: 'творог', category: 'dairy', unit: 'г' },
  { id: 'feta', name: 'фета', category: 'dairy', unit: 'г' },
  { id: 'cheese', name: 'сыр', category: 'dairy', unit: 'г' },
  { id: 'butter', name: 'сливочное масло', category: 'dairy', unit: 'г' },

  { id: 'rice', name: 'рис', category: 'grains', unit: 'г' },
  { id: 'buckwheat', name: 'гречка', category: 'grains', unit: 'г' },
  { id: 'spaghetti', name: 'спагетти', category: 'grains', unit: 'г' },
  { id: 'rolton', name: 'ролтон', category: 'grains', note: 'именно ролтон', frequent: true },

  { id: 'flour', name: 'мука', category: 'staples', unit: 'г' },
  { id: 'sugar', name: 'сахар', category: 'staples', unit: 'г' },
  { id: 'salt', name: 'соль', category: 'staples' },
  { id: 'vegetable-oil', name: 'растительное масло', category: 'staples', unit: 'мл' },
  { id: 'olive-oil', name: 'оливковое масло', category: 'staples', unit: 'мл' },
  { id: 'tomato-paste', name: 'томатная паста', category: 'staples', unit: 'г' },
  { id: 'olives', name: 'маслины', category: 'staples', unit: 'г' },
  { id: 'black-pepper', name: 'чёрный перец', category: 'staples' },
  { id: 'oregano', name: 'орегано', category: 'staples' },
  { id: 'cumin', name: 'зира', category: 'staples' },
  { id: 'bay-leaf', name: 'лавровый лист', category: 'staples' },
  { id: 'bread', name: 'хлеб', category: 'staples', frequent: true },
  { id: 'coffee-sweets', name: 'сладкое для кофе', category: 'staples', frequent: true },

  { id: 'meat', name: 'мясо', category: 'meat', frequent: true },
  { id: 'beef', name: 'говядина', category: 'meat', unit: 'г' },
  { id: 'chicken-fillet', name: 'куриное филе', category: 'meat', unit: 'шт' },
  { id: 'chicken-wings', name: 'куриные крылышки', category: 'meat', unit: 'шт' },
  { id: 'chicken-leg', name: 'куриная ножка', category: 'meat', unit: 'шт' },

  { id: 'cheburek', name: 'чебурек', category: 'ready', unit: 'шт', photo: 'cheburek.webp' },
  { id: 'school-pizza', name: 'школьная пицца', category: 'ready', unit: 'шт', photo: 'school-pizza.webp' },
  { id: 'khachapuri', name: 'маленькое хачапури', category: 'ready', unit: 'шт', photo: 'khachapuri.webp' },
  { id: 'ice-cream', name: 'мороженое', category: 'ready', unit: 'шт', photo: 'ice-cream.webp' },

  { id: 'cat-food', name: 'корм кошачий', category: 'other', frequent: true },
] as const satisfies readonly Product[];

export type ProductId = typeof products[number]['id'];

const registry: readonly Product[] = products;

const byId = new Map(registry.map(product => [product.id, product]));

export function productById(id: string): Product | undefined {
  return byId.get(id);
}

export function photoUrl(product: Product): string | undefined {
  return product.photo && `/products/${product.photo}`;
}

export const activeProducts: Product[] = registry.filter(product => !product.archived);

export const frequentProducts: Product[] = activeProducts.filter(product => product.frequent);

export function matchesQuery(named: { name: string }, query: string): boolean {
  const needle = query.trim().toLowerCase();

  return !needle || named.name.toLowerCase().includes(needle);
}

export function searchProducts(query: string, category?: string): Product[] {
  return activeProducts.filter(product => (
    (!category || product.category === category) && matchesQuery(product, query)
  ));
}
