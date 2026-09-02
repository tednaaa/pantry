<script setup lang="ts">
import type { Component } from 'vue';
import { ListChecksIcon, SettingsIcon, UtensilsCrossedIcon } from '@lucide/vue';
import { cn } from 'shonk-ui';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { usePlan } from '@/entities/plan';

interface NavItem {
  to: string;
  label: string;
  icon: Component;
}

const items: NavItem[] = [
  { to: '/', label: 'План', icon: UtensilsCrossedIcon },
  { to: '/list', label: 'Список', icon: ListChecksIcon },
  { to: '/settings', label: 'Настройки', icon: SettingsIcon },
];

const plan = usePlan();

const badges = computed<Record<string, number>>(() => ({ '/list': plan.value.length }));
</script>

<template>
  <nav class="border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
    <ul class="grid grid-cols-3">
      <li v-for="item in items" :key="item.to">
        <RouterLink #default="{ href, navigate, isExactActive }" :to="item.to" custom>
          <a
            :href="href"
            :class="cn(
              'flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] transition-colors',
              isExactActive ? 'text-primary' : 'text-muted-foreground',
            )"
            @click="navigate"
          >
            <span class="relative">
              <component :is="item.icon" class="size-5" />

              <span
                v-if="badges[item.to]"
                class="absolute -top-1.5 -right-2.5 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 font-medium text-primary-foreground tabular-nums"
              >
                {{ badges[item.to] }}
              </span>
            </span>

            {{ item.label }}
          </a>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
