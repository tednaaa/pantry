<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue';
import { Button } from 'shonk-ui';
import { RouterLink, useRouter } from 'vue-router';
import { useCustomProducts } from '@/entities/product';
import { categoryName } from '@/shared/lib';

const router = useRouter();

const products = useCustomProducts();
</script>

<template>
  <main class="flex min-h-0 flex-1 flex-col">
    <header class="flex shrink-0 items-center gap-1 px-2 pt-4 pb-2">
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-full text-text-secondary"
        aria-label="Назад"
        @click="router.back()"
      >
        <ChevronLeftIcon class="size-5" />
      </button>

      <h1 class="text-xl font-semibold text-text-primary">
        Свои продукты
      </h1>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-8">
      <p class="pb-4 text-xs text-text-tertiary">
        То, что покупается изредка и не заслуживает коммита в каталог. Блюда так не заводятся — их состав
        живёт в репозитории.
      </p>

      <ul v-if="products.length" class="flex flex-col">
        <li v-for="product in products" :key="product.id">
          <RouterLink
            :to="`/settings/products/${product.id}`"
            class="flex min-h-12 items-center justify-between gap-3 border-b border-border-default"
          >
            <span class="min-w-0 flex-1 truncate text-sm text-text-primary first-letter:uppercase">
              {{ product.name }}
            </span>

            <span class="flex shrink-0 items-center gap-1 text-sm text-text-tertiary">
              {{ categoryName(product.category) }}
              <ChevronRightIcon class="size-4" />
            </span>
          </RouterLink>
        </li>
      </ul>

      <p v-else class="py-8 text-center text-sm text-text-secondary">
        Пока ничего не заведено
      </p>

      <Button class="mt-6 w-full" @click="router.push('/settings/products/new')">
        Новый продукт
      </Button>
    </div>
  </main>
</template>
