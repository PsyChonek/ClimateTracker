// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    ssr: true,
    devtools: { enabled: true },
    typescript: {
        typeCheck: true,
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@formkit/auto-animate',
        '@nuxtjs/eslint-module',
    ],
    plugins: ['~/plugins/api', '~/plugins/pinia'],
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:9051',
        },
    },
});