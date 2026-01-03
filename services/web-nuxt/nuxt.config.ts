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
    plugins: ['~/plugins/pinia'],
    runtimeConfig: {
        // Private - server-side only, never exposed to client
        apiBaseUrl: process.env.API_BASE_URL || 'http://api:3000',
    },
});