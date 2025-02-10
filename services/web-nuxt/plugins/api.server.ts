import { defineNuxtPlugin } from '#app';
import { SensorsApi, ReadingsApi, Configuration } from '@/clients/api'; // Use an absolute path starting with @

export default defineNuxtPlugin((nuxtApp) => {
	const configEnv = useRuntimeConfig();

	// Set up the API client configuration
	const config = new Configuration({
		basePath: configEnv.public.apiBaseUrl, // Base URL for your API
	  });

	// Create an instance of the API client
	const sensorsApi = new SensorsApi(config);
	const readingsApi = new ReadingsApi(config);

	// Provide the API client to the Nuxt app context
	nuxtApp.provide('sensorsApi', sensorsApi);
	nuxtApp.provide('readingsApi', readingsApi);
});
