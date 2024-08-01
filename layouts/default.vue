<script setup lang="ts">
import AppHeader from '~/components/header/AppHeader.vue'
</script>

<template>
  <div>
    <header class="bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800">
      <AppHeader />
    </header>

    <slot />
  </div>
</template>
