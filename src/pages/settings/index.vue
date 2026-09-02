<script setup lang="ts">
import AboutSection from './ui/AboutSection.vue';
import CustomProductsSection from './ui/CustomProductsSection.vue';
import DataSection from './ui/DataSection.vue';
import InstallSection from './ui/InstallSection.vue';
</script>

<template>
  <main class="min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-8">
    <h1 class="text-xl font-semibold text-foreground">
      Настройки
    </h1>

    <section class="pt-8">
      <h2 class="pb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Свои продукты
      </h2>
      <CustomProductsSection />
    </section>

    <section class="pt-8">
      <h2 class="pb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Данные
      </h2>
      <DataSection />
    </section>

    <section class="pt-8">
      <h2 class="pb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Установка на iPhone
      </h2>
      <InstallSection />
    </section>

    <section class="pt-8">
      <h2 class="pb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        О приложении
      </h2>
      <AboutSection />
    </section>
  </main>
</template>
