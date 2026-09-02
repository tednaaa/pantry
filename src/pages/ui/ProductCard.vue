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
  <li class="relative">
    <button
      type="button"
      class="flex w-full flex-col gap-1.5 text-left"
      @click="emit('changeQty', toggleQty(props.qty))"
    >
      <PhotoThumb
        :src="photoUrl(product)"
        :name="product.name"
        :class="cn('aspect-square w-full rounded-xl', props.qty && 'ring-2 ring-ring')"
      />

      <p class="line-clamp-2 text-xs leading-tight text-foreground first-letter:uppercase">
        {{ product.name }}
      </p>
    </button>

    <div
      v-if="props.qty"
      class="absolute inset-x-0 top-0 flex h-9 items-center rounded-t-xl bg-background/90 backdrop-blur"
    >
      <button
        type="button"
        class="flex h-full flex-1 items-center justify-center text-muted-foreground"
        :aria-label="`Убрать ${product.name}`"
        @click="emit('changeQty', decreaseQty(props.qty))"
      >
        <MinusIcon class="size-4" />
      </button>

      <span class="w-9 text-center text-sm font-medium tabular-nums text-foreground">{{ props.qty }}</span>

      <button
        type="button"
        class="flex h-full flex-1 items-center justify-center text-muted-foreground"
        :aria-label="`Добавить ${product.name}`"
        @click="emit('changeQty', increaseQty(props.qty))"
      >
        <PlusIcon class="size-4" />
      </button>
    </div>
  </li>
</template>
