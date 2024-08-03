<script setup lang="ts">
const { data } = useAuthState()
const { signOut } = useAuth()
const toast = useToast()
const projectRepositoryUrl = useRuntimeConfig().public.projectRepositoryUrl

const items = [
  [{
    label: data.value?.username,
    slot: 'account',
    disabled: true,
  }], [{
    label: '设置',
    icon: 'i-heroicons-cog-8-tooth',
    disabled: true,
  }, {
    label: 'GitHub 仓库',
    icon: 'i-mdi-github',
    to: projectRepositoryUrl,
  }], [{
    label: '退出账号',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {
      signOut({ callbackUrl: '/' })
      toast.add({
        icon: 'i-heroicons-arrow-right-on-rectangle',
        id: 'logout_success',
        title: '退出账号',
        description: '账号已成功退出',
      })
    },
  }],
]
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      :label="data.username"
      color="white"
      variant="soft"
    >
      <template #leading>
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          size="2xs"
        />
      </template>
    </UButton>

    <template #account="{ item }">
      <div class="text-left">
        <p>
          登录身份
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<style scoped>
</style>
