import { ReadingsApi, Configuration } from '@/clients/api';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	
	// Create API configuration using the private server-side config
	const apiConfig = new Configuration({
		basePath: config.apiBaseUrl,
	});
	
	const readingsApi = new ReadingsApi(apiConfig);
	
	try {
		const response = await readingsApi.allReadingsGet();
		return response.data;
	} catch (error) {
		console.error('Error fetching readings:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch readings',
		});
	}
});
