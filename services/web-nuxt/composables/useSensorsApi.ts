/**
 * Composable for interacting with sensors API
 * All calls go through server-side API routes
 */
export const useSensorsApi = () => {
	const getAllSensors = async () => {
		return await $fetch('/api/sensors');
	};

	const updateSensor = async (id: string, data: { displayName?: string; temperatureOffset?: number; humidityOffset?: number; chartYAxisMin?: number; chartYAxisMax?: number }) => {
		return await $fetch(`/api/sensors/${id}`, {
			method: 'PATCH',
			body: data,
		});
	};

	return {
		getAllSensors,
		updateSensor,
	};
};
