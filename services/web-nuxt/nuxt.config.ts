// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	ssr: true,
	devtools: { enabled: true },
	typescript: {
		typeCheck: true,
	},
	modules: [
		'@pinia/nuxt',
		'@nuxtjs/tailwindcss',
		'@formkit/auto-animate',
		'@nuxtjs/eslint-module',
	],
	plugins: ['~/plugins/api.server'],
	runtimeConfig: {
		apiBaseUrl: process.env.API_BASE_URL,
	},
});
