import { defineNuxtPlugin } from '#app';
import { SensorsApi, ReadingsApi, Configuration } from '@/clients/api'; // Use an absolute path starting with @

export default defineNuxtPlugin((nuxtApp) => {
	// Set up the API client configuration
	const config = new Configuration({
		basePath: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:9051', // Base URL for your API
		// accessToken: () => {
		//   // Optionally inject a token if needed
		//   const token = localStorage.getItem('auth_token');
		//   return token || '';
		// },
	});

	// Create an instance of the API client
	const sensorsApi = new SensorsApi(config);
	const readingsApi = new ReadingsApi(config);

	// Provide the API client to the Nuxt app context
	nuxtApp.provide('sensorsApi', sensorsApi);
	nuxtApp.provide('readingsApi', readingsApi);
});
