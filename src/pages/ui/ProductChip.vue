<script setup lang="ts">
import type { Product } from '@/entities/product';
import { MinusIcon, PlusIcon } from '@lucide/vue';
import { decreaseQty, increaseQty } from '@/entities/plan';

const props = defineProps<{
  product: Product;
  qty: number;
}>();

const emit = defineEmits<{
  changeQty: [qty: number];
}>();
</script>

<template>
  <li>
    <button
      v-if="!props.qty"
      type="button"
      class="flex h-9 items-center rounded-full border border-border-default px-3 text-sm text-text-secondary first-letter:uppercase"
      @click="emit('changeQty', 1)"
    >
      {{ product.name }}
    </button>

    <div v-else class="flex h-9 items-center gap-0.5 rounded-full bg-bg-brand-subtle p-1 text-sm text-text-primary">
      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-full text-text-secondary"
        :aria-label="`Убрать ${product.name}`"
        @click="emit('changeQty', decreaseQty(props.qty))"
      >
        <MinusIcon class="size-4" />
      </button>

      <span class="px-1 first-letter:uppercase">
        {{ product.name }}<span v-if="props.qty > 1" class="tabular-nums">&nbsp;{{ props.qty }}×</span>
      </span>

      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-full text-text-secondary"
        :aria-label="`Добавить ${product.name}`"
        @click="emit('changeQty', increaseQty(props.qty))"
      >
        <PlusIcon class="size-4" />
      </button>
    </div>
  </li>
</template>
