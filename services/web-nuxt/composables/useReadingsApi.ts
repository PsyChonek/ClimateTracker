/**
 * Composable for interacting with readings API
 * All calls go through server-side API routes
 */
export const useReadingsApi = () => {
	const getAllReadings = async () => {
		return await $fetch('/api/readings');
	};

	return {
		getAllReadings,
	};
};
