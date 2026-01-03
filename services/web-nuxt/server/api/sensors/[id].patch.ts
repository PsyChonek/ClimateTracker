import { SensorsApi, Configuration } from '@/clients/api';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const id = getRouterParam(event, 'id');
	const body = await readBody(event);
	
	// Create API configuration using the private server-side config
	const apiConfig = new Configuration({
		basePath: config.apiBaseUrl,
	});
	
	const sensorsApi = new SensorsApi(apiConfig);
	
	try {
		const response = await sensorsApi.sensorPatch({
			id: id!,
			...body,
		});
		return response.data;
	} catch (error) {
		console.error('Error updating sensor:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to update sensor',
		});
	}
});
