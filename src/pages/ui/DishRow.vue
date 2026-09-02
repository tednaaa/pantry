<script setup lang="ts">
import type { Dish } from '@/entities/dish';
import { MinusIcon, PlusIcon } from '@lucide/vue';
import { cn } from 'shonk-ui';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { formatServings, photoUrl } from '@/entities/dish';
import { decreaseQty, increaseQty, toggleQty } from '@/entities/plan';
import { PhotoThumb } from '@/shared/ui';

const props = defineProps<{
  dish: Dish;
  qty: number;
}>();

const emit = defineEmits<{
  changeQty: [qty: number];
}>();

const servings = computed(() => formatServings(props.dish.servings * Math.max(props.qty, 1)));
</script>

<template>
  <li class="flex items-center gap-2 border-b border-border last:border-b-0">
    <button
      type="button"
      class="flex min-w-0 flex-1 items-center gap-3 py-2 text-left"
      @click="emit('changeQty', toggleQty(props.qty))"
    >
      <PhotoThumb
        :src="photoUrl(dish)"
        :name="dish.name"
        :class="cn('size-11 rounded-lg', props.qty && 'ring-2 ring-ring')"
      />

      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm text-foreground first-letter:uppercase">{{ dish.name }}</span>
        <span class="block text-xs tabular-nums text-muted-foreground">{{ servings }}</span>
      </span>
    </button>

    <RouterLink :to="`/dish/${dish.id}`" class="shrink-0 px-2 text-xs text-primary">
      Состав
    </RouterLink>

    <div v-if="props.qty" class="flex shrink-0 items-center">
      <button
        type="button"
        class="flex size-9 items-center justify-center text-muted-foreground"
        :aria-label="`Убрать ${dish.name}`"
        @click="emit('changeQty', decreaseQty(props.qty))"
      >
        <MinusIcon class="size-4" />
      </button>

      <span class="w-6 text-center text-sm font-medium tabular-nums text-foreground">{{ props.qty }}</span>

      <button
        type="button"
        class="flex size-9 items-center justify-center text-muted-foreground"
        :aria-label="`Добавить ${dish.name}`"
        @click="emit('changeQty', increaseQty(props.qty))"
      >
        <PlusIcon class="size-4" />
      </button>
    </div>
  </li>
</template>
