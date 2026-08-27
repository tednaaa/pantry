<script setup lang="ts">
import type { Product } from '@/entities/product';
import { MinusIcon, PlusIcon } from '@lucide/vue';
import { cn } from 'shonk-ui';
import { decreaseQty, increaseQty, toggleQty } from '@/entities/plan';
import { photoUrl } from '@/entities/product';
import { PhotoThumb } from '@/shared/ui';

const props = defineProps<{
  product: Product;
  qty: number;
}>();

const emit = defineEmits<{
  changeQty: [qty: number];
}>();
</script>

<template>
  <li class="flex items-center gap-2 border-b border-border-default last:border-b-0">
    <button
      type="button"
      class="flex min-w-0 flex-1 items-center gap-3 py-2 text-left"
      @click="emit('changeQty', toggleQty(props.qty))"
    >
      <PhotoThumb
        :src="photoUrl(product)"
        :name="product.name"
        :class="cn('size-11 rounded-lg', props.qty && 'ring-2 ring-border-brand')"
      />

      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm text-text-primary first-letter:uppercase">{{ product.name }}</span>
        <span v-if="product.note" class="block text-xs text-text-tertiary">{{ product.note }}</span>
      </span>
    </button>

    <div v-if="props.qty" class="flex shrink-0 items-center">
      <button
        type="button"
        class="flex size-9 items-center justify-center text-text-secondary"
        :aria-label="`Убрать ${product.name}`"
        @click="emit('changeQty', decreaseQty(props.qty))"
      >
        <MinusIcon class="size-4" />
      </button>

      <span class="w-6 text-center text-sm font-medium tabular-nums text-text-primary">{{ props.qty }}</span>

      <button
        type="button"
        class="flex size-9 items-center justify-center text-text-secondary"
        :aria-label="`Добавить ${product.name}`"
        @click="emit('changeQty', increaseQty(props.qty))"
      >
        <PlusIcon class="size-4" />
      </button>
    </div>
  </li>
</template>
