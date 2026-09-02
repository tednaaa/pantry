<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from 'shonk-ui';
import { computed, ref } from 'vue';

const props = defineProps<{
  src?: string;
  name: string;
  class?: HTMLAttributes['class'];
}>();

const failed = ref(false);

const initial = computed(() => props.name.trim().charAt(0).toUpperCase());
</script>

<template>
  <div :class="cn('flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted', props.class)">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="name"
      loading="lazy"
      class="size-full object-cover"
      @error="failed = true"
    >
    <span v-else class="text-sm font-medium text-muted-foreground">{{ initial }}</span>
  </div>
</template>
