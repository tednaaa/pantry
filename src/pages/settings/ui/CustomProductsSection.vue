<script setup lang="ts">
import { ChevronRightIcon } from '@lucide/vue';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCustomProducts } from '@/entities/product';
import { pluralize } from '@/shared/lib';

const products = useCustomProducts();

const summary = computed(() => {
  const count = products.value.length;

  return count
    ? `${count} ${pluralize(count, ['продукт', 'продукта', 'продуктов'])}`
    : 'Пока ничего не заведено';
});
</script>

<template>
  <RouterLink
    to="/settings/products"
    class="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border-default px-4 py-3"
  >
    <span class="text-sm text-text-primary">Список</span>

    <span class="flex items-center gap-1 text-sm text-text-tertiary">
      {{ summary }}
      <ChevronRightIcon class="size-4" />
    </span>
  </RouterLink>
</template>
