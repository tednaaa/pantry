<script setup lang="ts">
import { Input, Label, NativeSelect, NativeSelectOption } from 'shonk-ui';
import { categories, units } from '@/shared/lib';

const name = defineModel<string>('name', { required: true });
const category = defineModel<string>('category', { required: true });
const unit = defineModel<string>('unit', { required: true });
const note = defineModel<string>('note', { required: true });
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <Label for="product-name">Название</Label>
      <Input id="product-name" v-model="name" placeholder="Фольга для запекания" />
    </div>

    <div class="flex flex-col gap-2">
      <Label for="product-category">Отдел</Label>
      <NativeSelect id="product-category" v-model="category">
        <NativeSelectOption v-for="option in categories" :key="option.id" :value="option.id">
          {{ option.name }}
        </NativeSelectOption>
      </NativeSelect>
      <p class="text-xs text-muted-foreground">
        Определяет, в какой группе списка встанет продукт.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="product-unit">Единица</Label>
      <NativeSelect id="product-unit" v-model="unit">
        <NativeSelectOption value="">Без единицы</NativeSelectOption>
        <NativeSelectOption v-for="option in units" :key="option" :value="option">
          {{ option }}
        </NativeSelectOption>
      </NativeSelect>
      <p class="text-xs text-muted-foreground">
        Нужна, только если продукт попадает в состав блюда. Иначе в списке хватит счётчика штук.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="product-note">Пометка</Label>
      <Input id="product-note" v-model="note" placeholder="маленькая" />
    </div>
  </div>
</template>
