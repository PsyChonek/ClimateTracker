import { defineNuxtPlugin } from '#app';
import { SensorsApi, ReadingsApi } from '~/clients/api/src';
import ApiClient from '~/clients/api/src/ApiClient';

export default defineNuxtPlugin((nuxtApp) => {
	const apiClient = new ApiClient();
	apiClient.basePath = nuxtApp.$config.apiBaseUrl;
	
	const sensorsApi = new SensorsApi(apiClient);
	const readingsApi = new ReadingsApi(apiClient);

	nuxtApp.provide('sensorsApi', sensorsApi);
	nuxtApp.provide('readingsApi', readingsApi);
});

