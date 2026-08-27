import type { Ref } from 'vue';
import type { CustomProduct } from '@/shared/db';
import { useLiveQuery } from '@/shared/lib';
import { listCustomProducts } from './custom-product';

export function useCustomProducts(): Ref<CustomProduct[]> {
  return useLiveQuery<CustomProduct[]>(() => listCustomProducts(), []);
}
