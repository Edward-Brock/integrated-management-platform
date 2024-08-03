<script setup lang="ts">
</script>

<template>
  <UContainer class="h-16 flex flex-row items-center justify-between gap-3">
    <div>
      <UTooltip
        text="综合管理平台（Integrated Management Platform）"
        :popper="{ placement: 'bottom-end' }"
      >
        IMP
      </UTooltip>
    </div>

    <div class="flex flex-col flex-wrap items-center justify-center">
      <!-- 注册/登录区域 -->
      <div class="flex flex-wrap items-center justify-center">
        <UButton
          size="md"
          color="gray"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          to="/signup"
        >
          注册
        </UButton>

        <UButton
          class="ml-2"
          size="md"
          variant="solid"
          :ui="{ rounded: 'rounded-full' }"
          to="/login"
        >
          <template #trailing>
            <UIcon
              name="i-heroicons-arrow-right-20-solid"
              class="w-5 h-5"
            />
          </template>
          登录
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
</style>
