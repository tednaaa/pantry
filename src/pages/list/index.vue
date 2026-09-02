<script setup lang="ts">
import { CopyIcon, XIcon } from '@lucide/vue';
import { useClipboard } from '@vueuse/core';
import { Badge, Button, Checkbox, toast, useConfirm } from 'shonk-ui';
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { formatServings } from '@/entities/dish';
import {
  buildShoppingList,
  buildShoppingText,
  clearChecks,
  clearPlan,
  countCheckedItems,
  countShoppingItems,
  resolvePlan,
  setChecked,
  setQty,
  useChecks,
  usePlan,
} from '@/entities/plan';
import { useCustomProducts } from '@/entities/product';
import { pluralize } from '@/shared/lib';

const router = useRouter();
const confirmation = useConfirm();
const { copy } = useClipboard();

const items = usePlan();
const marks = useChecks();
const customProducts = useCustomProducts();

const plan = computed(() => resolvePlan(items.value, customProducts.value));
const groups = computed(() => buildShoppingList(plan.value));
const checked = computed(() => new Set(marks.value.map(mark => mark.key)));

const total = computed(() => countShoppingItems(groups.value));
const done = computed(() => countCheckedItems(groups.value, checked.value));

const summary = computed(() => {
  const bought = pluralize(done.value, ['куплен', 'куплено', 'куплено']);

  return `${done.value} из ${total.value} ${bought}`;
});

async function copyList() {
  await copy(buildShoppingText(plan.value, groups.value));
  toast('Список скопирован');
}

function askToClear() {
  confirmation.require({
    message: 'План и отметки о покупках будут стёрты. Каталог блюд и свои продукты останутся на месте.',
    acceptButtonText: 'Очистить',
    accept: () => {
      void clearPlan();
    },
  });
}
</script>

<template>
  <main class="flex min-h-0 flex-1 flex-col">
    <header class="flex shrink-0 items-baseline justify-between gap-3 px-4 pt-6 pb-3">
      <h1 class="text-xl font-semibold text-foreground">
        Список
      </h1>

      <button
        v-if="done"
        type="button"
        class="shrink-0 text-xs text-primary"
        @click="clearChecks()"
      >
        Снять отметки
      </button>
    </header>

    <div v-if="!total" class="min-h-0 flex-1 overflow-y-auto px-4 py-8 text-center">
      <p class="text-sm text-muted-foreground">
        План пуст — выбери блюда и продукты, и список соберётся сам.
      </p>

      <Button variant="outline" class="mt-3" @click="router.push('/')">
        Собрать план
      </Button>
    </div>

    <div v-else class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
      <p class="pb-4 text-xs tabular-nums text-muted-foreground">
        {{ summary }}
      </p>

      <div v-if="plan.dishes.length" class="flex flex-wrap gap-1.5 pb-6">
        <Badge
          v-for="{ dish, qty } in plan.dishes"
          :key="dish.id"
          variant="secondary"
          class="gap-1 pr-1"
        >
          <RouterLink :to="`/dish/${dish.id}`" class="first-letter:uppercase">
            {{ dish.name }} · {{ formatServings(dish.servings * qty) }}
          </RouterLink>

          <button type="button" :aria-label="`Убрать ${dish.name}`" @click="setQty('dish', dish.id, 0)">
            <XIcon class="size-3" />
          </button>
        </Badge>
      </div>

      <section v-for="group in groups" :key="group.category" class="pb-6">
        <h2 class="pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {{ group.name }}
        </h2>

        <ul class="flex flex-col">
          <li v-for="item in group.items" :key="item.id">
            <label class="flex min-h-11 cursor-pointer items-center gap-3">
              <Checkbox
                :model-value="checked.has(item.id)"
                @update:model-value="setChecked(item.id, $event === true)"
              />

              <span
                class="min-w-0 flex-1 text-sm first-letter:uppercase"
                :class="checked.has(item.id) ? 'text-muted-foreground line-through' : 'text-foreground'"
              >
                {{ item.name }}
                <span v-if="item.note" class="text-muted-foreground">({{ item.note }})</span>
              </span>

              <span v-if="item.amount" class="shrink-0 text-sm tabular-nums text-muted-foreground">
                {{ item.amount }}
              </span>
            </label>
          </li>
        </ul>
      </section>
    </div>

    <Teleport defer to="#bottom-dock">
      <div v-if="total" class="flex gap-3 border-t border-border bg-background px-4 py-3">
        <Button class="flex-1" @click="copyList">
          <CopyIcon class="size-4" />
          Скопировать
        </Button>

        <Button variant="outline" @click="askToClear">
          Очистить
        </Button>
      </div>
    </Teleport>
  </main>
</template>
