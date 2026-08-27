<script setup lang="ts">
import type { ViewMode } from './lib/view-mode';
import type { Product } from '@/entities/product';
import type { CategoryId } from '@/shared/lib';
import { Grid2x2Icon, LayoutGridIcon, ListIcon } from '@lucide/vue';
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Input,
} from 'shonk-ui';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { searchDishes } from '@/entities/dish';
import { setQty, usePlan } from '@/entities/plan';
import { frequentProducts, matchesQuery, searchProducts, toProduct, useCustomProducts } from '@/entities/product';
import { categories } from '@/shared/lib';
import { useViewMode, viewModeName, viewModes } from './lib/view-mode';
import DishSection from './ui/DishSection.vue';
import ProductSection from './ui/ProductSection.vue';

type ChipId = CategoryId | 'all' | 'dishes' | 'custom';

const chips: { id: ChipId; name: string }[] = [
  { id: 'all', name: 'Все' },
  { id: 'dishes', name: 'Блюда' },
  ...categories.map(({ id, name }) => ({ id: id as ChipId, name })),
  { id: 'custom', name: 'Своё' },
];

const viewIcons = { grid: LayoutGridIcon, large: Grid2x2Icon, list: ListIcon };

const router = useRouter();

const query = ref('');
const chip = ref<ChipId>('all');

const view = useViewMode();

const viewIcon = computed(() => viewIcons[view.value] ?? LayoutGridIcon);

function chooseView(mode: unknown) {
  view.value = mode as ViewMode;
}

const items = usePlan();
const customProducts = useCustomProducts();

const showsEverything = computed(() => chip.value === 'all');

const dishes = computed(() => (
  showsEverything.value || chip.value === 'dishes' ? searchDishes(query.value) : []
));

const custom = computed<Product[]>(() => {
  if (chip.value === 'dishes') {
    return [];
  }

  const all = customProducts.value.map(toProduct);

  if (chip.value === 'custom') {
    return all.filter(product => matchesQuery(product, query.value));
  }

  return all.filter(product => (
    matchesQuery(product, query.value) && (showsEverything.value || product.category === chip.value)
  ));
});

const groups = computed(() => {
  if (chip.value === 'dishes' || chip.value === 'custom') {
    return [];
  }

  return categories
    .map(({ id, name }) => ({
      id,
      name,
      products: searchProducts(query.value, showsEverything.value ? undefined : id)
        .filter(product => product.category === id),
    }))
    .filter(group => group.products.length > 0);
});

const showsFrequent = computed(() => (
  showsEverything.value && !query.value.trim() && frequentProducts.length > 0
));

const isEmpty = computed(() => (
  dishes.value.length === 0 && custom.value.length === 0 && groups.value.length === 0
));

function changeDish(dishId: string, qty: number) {
  void setQty('dish', dishId, qty);
}

function changeProduct(productId: string, qty: number) {
  void setQty('product', productId, qty);
}

function openNewProduct() {
  void router.push({ path: '/settings/products/new', query: { toPlan: '1' } });
}
</script>

<template>
  <main class="flex min-h-0 flex-1 flex-col">
    <header class="flex shrink-0 items-center gap-2 px-4 pt-6 pb-3">
      <Input
        v-model="query"
        type="search"
        enterkeyhint="search"
        placeholder="Блюдо, тег или продукт"
        class="flex-1"
      />

      <Button variant="outline" @click="openNewProduct">
        Новое
      </Button>
    </header>

    <div class="flex shrink-0 items-center gap-2 border-b border-border-default pb-3 pl-4">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-default text-text-secondary"
            :aria-label="`Вид: ${viewModeName(view)}`"
          >
            <component :is="viewIcon" class="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup :model-value="view" @update:model-value="chooseView">
            <DropdownMenuRadioItem v-for="mode in viewModes" :key="mode.id" :value="mode.id">
              <component :is="viewIcons[mode.id]" class="size-4" />
              {{ mode.name }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div class="scrollbar-none min-w-0 flex-1 overflow-x-auto">
        <div class="flex w-max gap-2 pr-4">
          <button
            v-for="item in chips"
            :key="item.id"
            type="button"
            :class="cn(
              'rounded-full border px-3 py-1.5 text-xs whitespace-nowrap',
              chip === item.id
                ? 'border-transparent bg-bg-brand text-text-inverse'
                : 'border-border-default text-text-secondary',
            )"
            @click="chip = item.id"
          >
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-6">
      <template v-if="showsFrequent">
        <h2 class="pb-2 text-xs font-medium tracking-wide text-text-tertiary uppercase">
          Часто
        </h2>

        <ProductSection
          :products="frequentProducts"
          :items="items"
          :mode="view"
          @change-qty="changeProduct"
        />
      </template>

      <template v-if="dishes.length">
        <h2 class="pb-2 text-xs font-medium tracking-wide text-text-tertiary uppercase">
          Блюда
        </h2>

        <DishSection :dishes="dishes" :items="items" :mode="view" @change-qty="changeDish" />
      </template>

      <template v-if="custom.length">
        <h2 class="pb-2 text-xs font-medium tracking-wide text-text-tertiary uppercase">
          Своё
        </h2>

        <ProductSection :products="custom" :items="items" :mode="view" @change-qty="changeProduct" />
      </template>

      <template v-for="group in groups" :key="group.id">
        <h2 class="pb-2 text-xs font-medium tracking-wide text-text-tertiary uppercase">
          {{ group.name }}
        </h2>

        <ProductSection
          :products="group.products"
          :items="items"
          :mode="view"
          @change-qty="changeProduct"
        />
      </template>

      <div v-if="isEmpty" class="py-8 text-center">
        <p class="text-sm text-text-secondary">
          Ничего не нашлось
        </p>

        <Button variant="outline" class="mt-3" @click="openNewProduct">
          Добавить своё
        </Button>
      </div>
    </div>
  </main>
</template>
