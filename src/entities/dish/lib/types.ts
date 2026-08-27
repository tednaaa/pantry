import type { ProductId } from '@/entities/product';

export const tags = ['завтрак', 'обед', 'ужин', 'мясо', 'рыба', 'салат', 'быстро'] as const;

export type Tag = typeof tags[number];

export interface Ingredient {
  product: ProductId;
  amount?: number;
}

export interface Dish {
  id: string;
  name: string;
  photo?: string;
  tags: Tag[];
  servings: number;
  ingredients: Ingredient[];
  steps?: string[];
  archived?: boolean;
}
