<script setup lang="ts">
import type { CustomProduct } from '@/shared/db';
import { ChevronLeftIcon } from '@lucide/vue';
import { Button, toast, useConfirm } from 'shonk-ui';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  CustomProductFields,
  draftFromCustomProduct,
  draftToCustomProduct,
  emptyCustomDraft,
  loadCustomProduct,
  removeCustomProduct,
  saveCustomProduct,
} from '@/entities/product';
import { useLiveQuery } from '@/shared/lib';

const route = useRoute('/settings/products/[id]');
const router = useRouter();
const confirmation = useConfirm();

const id = computed(() => String(route.params.id));

const product = useLiveQuery<CustomProduct | undefined>(() => loadCustomProduct(id.value), undefined, [id]);

const draft = ref(emptyCustomDraft());
const saving = ref(false);

watch(product, (loaded) => {
  if (loaded) {
    draft.value = draftFromCustomProduct(loaded);
  }
}, { immediate: true });

const input = computed(() => draftToCustomProduct(draft.value));

async function save() {
  const current = product.value;
  const value = input.value;

  if (!current || !value || saving.value) {
    return;
  }

  saving.value = true;

  try {
    await saveCustomProduct(current, value);
    await router.push('/settings/products');
  }
  catch (error) {
    console.error('[save]', error);
    saving.value = false;
    toast('Не удалось сохранить, попробуй ещё раз');
  }
}

async function remove() {
  await removeCustomProduct(id.value);
  await router.push('/settings/products');
}

function askToRemove() {
  confirmation.require({
    message: 'Продукт исчезнет и из своих продуктов, и из текущего плана. Каталог и блюда не изменятся.',
    acceptButtonText: 'Удалить',
    accept: () => {
      void remove();
    },
  });
}
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
        Свой продукт
      </h1>
    </header>

    <div v-if="!product" class="min-h-0 flex-1 overflow-y-auto px-4 py-8 text-center">
      <p class="text-sm text-text-secondary">
        Такого продукта больше нет
      </p>

      <Button variant="outline" class="mt-3" @click="router.push('/settings/products')">
        К списку
      </Button>
    </div>

    <div v-else class="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8">
      <CustomProductFields
        v-model:name="draft.name"
        v-model:category="draft.category"
        v-model:unit="draft.unit"
        v-model:note="draft.note"
      />

      <Button class="mt-8 w-full" :disabled="!input" :loading="saving" @click="save">
        Сохранить
      </Button>

      <Button variant="destructive" class="mt-3 w-full" @click="askToRemove">
        Удалить продукт
      </Button>
    </div>
  </main>
</template>
