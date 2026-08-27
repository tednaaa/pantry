<script setup lang="ts">
import type { ViewMode } from '../lib/view-mode';
import type { Dish } from '@/entities/dish';
import type { PlanItem } from '@/shared/db';
import { cn } from 'shonk-ui';
import { qtyOf } from '@/entities/plan';
import DishCard from './DishCard.vue';
import DishRow from './DishRow.vue';

const props = defineProps<{
  dishes: Dish[];
  items: PlanItem[];
  mode: ViewMode;
}>();

const emit = defineEmits<{
  changeQty: [dishId: string, qty: number];
}>();
</script>

<template>
  <ul v-if="props.mode === 'list'" class="mb-4 flex flex-col">
    <DishRow
      v-for="dish in props.dishes"
      :key="dish.id"
      :dish="dish"
      :qty="qtyOf(props.items, 'dish', dish.id)"
      @change-qty="emit('changeQty', dish.id, $event)"
    />
  </ul>

  <ul v-else :class="cn('mb-4 grid gap-3', props.mode === 'large' ? 'grid-cols-2' : 'grid-cols-3')">
    <DishCard
      v-for="dish in props.dishes"
      :key="dish.id"
      :dish="dish"
      :qty="qtyOf(props.items, 'dish', dish.id)"
      @change-qty="emit('changeQty', dish.id, $event)"
    />
  </ul>
</template>
