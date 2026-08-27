<script setup lang="ts">
import { ChevronLeftIcon, MinusIcon, PlusIcon } from '@lucide/vue';
import { Badge, Button, Separator } from 'shonk-ui';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dishById, formatServings, photoUrl } from '@/entities/dish';
import { decreaseQty, increaseQty, qtyOf, setQty, usePlan } from '@/entities/plan';
import { productById } from '@/entities/product';
import { formatAmount } from '@/shared/lib';
import { PhotoThumb } from '@/shared/ui';

const route = useRoute('/dish/[id]');
const router = useRouter();

const items = usePlan();

const dish = computed(() => dishById(String(route.params.id)));

const qty = computed(() => (dish.value ? qtyOf(items.value, 'dish', dish.value.id) : 0));

const servings = computed(() => (dish.value ? dish.value.servings * Math.max(qty.value, 1) : 0));

const composition = computed(() => dish.value?.ingredients.map((ingredient) => {
  const product = productById(ingredient.product);
  const scaled = (ingredient.amount ?? 0) * Math.max(qty.value, 1);

  return {
    id: ingredient.product,
    name: product?.name ?? ingredient.product,
    note: product?.note,
    amount: scaled && product?.unit ? formatAmount(scaled, product.unit) : '',
  };
}) ?? []);

function change(next: number) {
  if (dish.value) {
    void setQty('dish', dish.value.id, next);
  }
}
</script>

<template>
  <main class="flex min-h-0 flex-1 flex-col">
    <header class="flex shrink-0 items-center gap-2 px-2 pt-4 pb-2">
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-full text-text-secondary"
        aria-label="Назад"
        @click="router.back()"
      >
        <ChevronLeftIcon class="size-5" />
      </button>
    </header>

    <div v-if="!dish" class="min-h-0 flex-1 overflow-y-auto px-4 py-8 text-center">
      <p class="text-sm text-text-secondary">
        Такого блюда нет в каталоге
      </p>

      <Button variant="outline" class="mt-3" @click="router.push('/')">
        К плану
      </Button>
    </div>

    <div v-else class="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
      <PhotoThumb :src="photoUrl(dish)" :name="dish.name" class="aspect-video w-full rounded-xl" />

      <h1 class="pt-4 text-xl font-semibold text-text-primary first-letter:uppercase">
        {{ dish.name }}
      </h1>

      <div class="flex flex-wrap gap-1.5 pt-2">
        <Badge v-for="tag in dish.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
      </div>

      <div class="flex items-center gap-3 pt-5">
        <Button v-if="!qty" class="flex-1" @click="change(1)">
          Добавить в план
        </Button>

        <template v-else>
          <div class="flex h-9 flex-1 items-center justify-between rounded-full bg-bg-brand-subtle px-1">
            <button
              type="button"
              class="flex size-7 items-center justify-center rounded-full text-text-secondary"
              aria-label="Готовим меньше"
              @click="change(decreaseQty(qty))"
            >
              <MinusIcon class="size-4" />
            </button>

            <span class="text-sm tabular-nums text-text-primary">готовим {{ qty }}×</span>

            <button
              type="button"
              class="flex size-7 items-center justify-center rounded-full text-text-secondary"
              aria-label="Готовим больше"
              @click="change(increaseQty(qty))"
            >
              <PlusIcon class="size-4" />
            </button>
          </div>
        </template>

        <span class="shrink-0 text-sm tabular-nums text-text-tertiary">{{ formatServings(servings) }}</span>
      </div>

      <Separator class="my-6" />

      <h2 class="pb-2 text-xs font-medium tracking-wide text-text-tertiary uppercase">
        Состав
      </h2>

      <ul class="flex flex-col">
        <li
          v-for="ingredient in composition"
          :key="ingredient.id"
          class="flex min-h-9 items-center justify-between gap-3 text-sm"
        >
          <span class="min-w-0 flex-1 text-text-primary first-letter:uppercase">
            {{ ingredient.name }}
            <span v-if="ingredient.note" class="text-text-tertiary">({{ ingredient.note }})</span>
          </span>

          <span v-if="ingredient.amount" class="shrink-0 tabular-nums text-text-tertiary">
            {{ ingredient.amount }}
          </span>
        </li>
      </ul>

      <template v-if="dish.steps?.length">
        <Separator class="my-6" />

        <h2 class="pb-2 text-xs font-medium tracking-wide text-text-tertiary uppercase">
          Как готовить
        </h2>

        <ol class="flex list-inside list-decimal flex-col gap-2 text-sm text-text-secondary marker:text-text-tertiary marker:tabular-nums">
          <li v-for="step in dish.steps" :key="step">{{ step }}</li>
        </ol>
      </template>
    </div>
  </main>
</template>
