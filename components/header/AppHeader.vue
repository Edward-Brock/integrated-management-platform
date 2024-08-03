<script setup lang="ts">
import UserDropdown from '../UserDropdown.vue'

const { status } = useAuth()
const projectName = useRuntimeConfig().public.projectName as string
const projectFullName = useRuntimeConfig().public.projectFullName as string
</script>

<template>
  <UContainer class="h-16 flex flex-row items-center justify-between gap-3">
    <div>
      <UTooltip
        :text="projectFullName"
        :popper="{ placement: 'bottom-end' }"
      >
        {{ projectName }}
      </UTooltip>
    </div>

    <div class="flex flex-col flex-wrap items-center justify-center">
      <!-- 注册/登录区域 -->
      <div
        v-if="status==='unauthenticated'"
        class="flex flex-wrap items-center justify-center"
      >
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

      <!-- 用户下拉信息区域 -->
      <div v-else-if="status==='authenticated'">
        <UserDropdown />
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
</style>
