// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET, // 项目 Secret
    cookieDomain: process.env.COOKIE_DOMAIN, // JWT 签发者
    authAccessExpiresIn: process.env.AUTH_ACCESS_EXPIRES_IN, // Access Token 过期时间
    authRefreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN, // Refresh Token 过期时间
    public: {
      projectName: process.env.NUXT_PROJECT_NAME, // 项目简称
      projectFullName: process.env.NUXT_PROJECT_FULL_NAME, // 项目全程
      projectDescription: process.env.NUXT_PROJECT_DESCRIPTION, // 项目描述
      projectRepositoryUrl: process.env.NUXT_PROJECT_REPOSITORY_URL, // 项目代码托管存储库地址
      projectLicenseType: process.env.NUXT_PROJECT_LICENSE_TYPE, // 项目许可证类型
      projectLicenseUrl: process.env.NUXT_PROJECT_LICENSE_URL, // 项目许可证地址
    },
  },
  modules: ['@nuxt/eslint', "@nuxt/ui", '@sidebase/nuxt-auth'],
  eslint: {
    config: {
      stylistic: true
    }
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    baseURL: '/api/auth',
    provider: {
      type: 'refresh',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/user', method: 'get' },
        refresh: { path: '/refresh', method: 'post' },
      },
      token: {
        signInResponseTokenPointer: '/token/accessToken',
        maxAgeInSeconds: process.env.AUTH_MAX_AGE_IN_SECONDS as number | undefined,
        sameSiteAttribute: 'lax',
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/token/refreshToken',
        refreshRequestTokenPointer: '/refreshToken',
      },
    },
  },
})
