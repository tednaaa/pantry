<script setup lang="ts">
import { computed } from 'vue';
import { dishes } from '@/entities/dish';
import { products } from '@/entities/product';

const buildDate = computed(() => new Intl.DateTimeFormat('ru-RU').format(new Date(__BUILD_DATE__)));

const rows = computed(() => [
  { label: 'Версия', value: __APP_VERSION__ },
  { label: 'Сборка', value: buildDate.value },
  { label: 'Блюд в каталоге', value: String(dishes.length) },
  { label: 'Продуктов в каталоге', value: String(products.length) },
]);
</script>

<template>
  <dl class="flex flex-col gap-2">
    <div v-for="row in rows" :key="row.label" class="flex justify-between gap-3 text-sm">
      <dt class="text-text-secondary">{{ row.label }}</dt>
      <dd class="tabular-nums text-text-primary">{{ row.value }}</dd>
    </div>
  </dl>
</template>
