<script setup lang="ts">
import { ChevronLeftIcon } from '@lucide/vue';
import { Button, toast } from 'shonk-ui';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { setQty } from '@/entities/plan';
import { createCustomProduct, CustomProductFields, draftToCustomProduct, emptyCustomDraft } from '@/entities/product';

const route = useRoute();
const router = useRouter();

const draft = ref(emptyCustomDraft());
const saving = ref(false);

const goesToPlan = computed(() => route.query.toPlan === '1');

const input = computed(() => draftToCustomProduct(draft.value));

async function save() {
  const value = input.value;

  if (!value || saving.value) {
    return;
  }

  saving.value = true;

  try {
    const product = await createCustomProduct(value);

    if (goesToPlan.value) {
      await setQty('product', product.id, 1);
      await router.push('/');
    }
    else {
      await router.push('/settings/products');
    }
  }
  catch (error) {
    console.error('[save]', error);
    saving.value = false;
    toast('Не удалось сохранить, попробуй ещё раз');
  }
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
        Новый продукт
      </h1>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8">
      <CustomProductFields
        v-model:name="draft.name"
        v-model:category="draft.category"
        v-model:unit="draft.unit"
        v-model:note="draft.note"
      />

      <Button class="mt-8 w-full" :disabled="!input" :loading="saving" @click="save">
        {{ goesToPlan ? 'Сохранить и добавить в план' : 'Сохранить' }}
      </Button>
    </div>
  </main>
</template>
