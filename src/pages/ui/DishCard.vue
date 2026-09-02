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
  <li class="relative">
    <button
      type="button"
      class="flex w-full flex-col gap-1.5 text-left"
      @click="emit('changeQty', toggleQty(props.qty))"
    >
      <PhotoThumb
        :src="photoUrl(dish)"
        :name="dish.name"
        :class="cn('aspect-square w-full rounded-xl', props.qty && 'ring-2 ring-ring')"
      />

      <p class="line-clamp-2 text-xs leading-tight text-foreground first-letter:uppercase">
        {{ dish.name }}
      </p>
    </button>

    <div class="flex items-baseline justify-between gap-2">
      <span class="text-[11px] tabular-nums text-muted-foreground">{{ servings }}</span>

      <RouterLink :to="`/dish/${dish.id}`" class="shrink-0 text-[11px] text-primary">
        Состав
      </RouterLink>
    </div>

    <div
      v-if="props.qty"
      class="absolute inset-x-0 top-0 flex h-9 items-center rounded-t-xl bg-background/90 backdrop-blur"
    >
      <button
        type="button"
        class="flex h-full flex-1 items-center justify-center text-muted-foreground"
        :aria-label="`Убрать ${dish.name}`"
        @click="emit('changeQty', decreaseQty(props.qty))"
      >
        <MinusIcon class="size-4" />
      </button>

      <span class="w-9 text-center text-sm font-medium tabular-nums text-foreground">{{ props.qty }}</span>

      <button
        type="button"
        class="flex h-full flex-1 items-center justify-center text-muted-foreground"
        :aria-label="`Добавить ${dish.name}`"
        @click="emit('changeQty', increaseQty(props.qty))"
      >
        <PlusIcon class="size-4" />
      </button>
    </div>
  </li>
</template>
