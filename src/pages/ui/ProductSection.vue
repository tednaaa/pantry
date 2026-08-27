<script setup lang="ts">
import type { ViewMode } from '../lib/view-mode';
import type { Product } from '@/entities/product';
import type { PlanItem } from '@/shared/db';
import { cn } from 'shonk-ui';
import { computed } from 'vue';
import { qtyOf } from '@/entities/plan';
import ProductCard from './ProductCard.vue';
import ProductChip from './ProductChip.vue';
import ProductRow from './ProductRow.vue';

const props = defineProps<{
  products: Product[];
  items: PlanItem[];
  mode: ViewMode;
}>();

const emit = defineEmits<{
  changeQty: [productId: string, qty: number];
}>();

const withPhoto = computed(() => props.products.filter(product => product.photo));
const withoutPhoto = computed(() => props.products.filter(product => !product.photo));
</script>

<template>
  <ul v-if="props.mode === 'list'" class="mb-4 flex flex-col">
    <ProductRow
      v-for="product in props.products"
      :key="product.id"
      :product="product"
      :qty="qtyOf(props.items, 'product', product.id)"
      @change-qty="emit('changeQty', product.id, $event)"
    />
  </ul>

  <template v-else>
    <ul
      v-if="withPhoto.length"
      :class="cn('mb-4 grid gap-3', props.mode === 'large' ? 'grid-cols-2' : 'grid-cols-3')"
    >
      <ProductCard
        v-for="product in withPhoto"
        :key="product.id"
        :product="product"
        :qty="qtyOf(props.items, 'product', product.id)"
        @change-qty="emit('changeQty', product.id, $event)"
      />
    </ul>

    <ul v-if="withoutPhoto.length" class="mb-4 flex flex-wrap gap-2">
      <ProductChip
        v-for="product in withoutPhoto"
        :key="product.id"
        :product="product"
        :qty="qtyOf(props.items, 'product', product.id)"
        @change-qty="emit('changeQty', product.id, $event)"
      />
    </ul>
  </template>
</template>
