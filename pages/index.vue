<script setup lang="ts">
const { status, data } = useAuth()
</script>

<template>
  <UContainer class="my-5">
    <div>You are currently {{ status }}.</div>
    <div v-if="data">
      Hello {{ data.username }}!
    </div>
    <div v-else>
      You are not logged in.
    </div>
  </UContainer>
</template>

<style scoped>
</style>
