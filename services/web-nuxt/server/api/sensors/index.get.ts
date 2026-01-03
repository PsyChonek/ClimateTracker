import { SensorsApi, Configuration } from '@/clients/api';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	
	// Create API configuration using the private server-side config
	const apiConfig = new Configuration({
		basePath: config.apiBaseUrl,
	});
	
	const sensorsApi = new SensorsApi(apiConfig);
	
	try {
		const response = await sensorsApi.allSensorsGet();
		return response.data;
	} catch (error) {
		console.error('Error fetching sensors:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch sensors',
		});
	}
});
