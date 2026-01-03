<template>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<div class="p-2 bg-gray-800 rounded-lg shadow-md w-full flex row items-center">
			<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] justify-items-center gap-4 w-full">
				<slot v-for="(item, index) in sensorStore.sensors" :key="index" :item="item">
					<button :class="{ 'bg-purple-900': item.selected }" class="flex justify-center items-center p-2 border border-gray-300 w-[180px] rounded-lg shadow-md hover:bg-purple-800 transition-colors duration-300" @click="sensorClick(item)">
						<p class="text-white font-bold">{{ item.displayName || item.espID }}</p>
					</button>
				</slot>
				<!-- Show warning if API not available -->
				<div v-if="error" class="text-red-500">Error fetching sensors</div>
			</div>
			<button :class="{ 'bg-purple-900': true }" class="flex justify-center items-center p-2 py-2 text-white rounded-lg shadow-md hover:bg-purple-800 transition-colors duration-300" @click="openModal">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6 shadow-md" style="color: white;" fill="currentColor">
					<path
						d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
				</svg>
			</button>
		</div>
	</div>
	<SettingsModal :show="showModal" @close="closeModal" />
</template>

<script setup>
import { useSensorStore } from '../stores/sensor';

const showModal = ref(false);

const openModal = () => {
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
};

const sensorStore = useSensorStore();
const sensorsApi = useSensorsApi();

const { data: sensors, error } = await useAsyncData('sensors', async () => {
	return await sensorsApi.getAllSensors();
});

if (error.value) {
	console.error("Error fetching sensors:", error.value);
} else if (sensors.value) {
	// Add default values for missing properties
	const sensorsWithDefaults = sensors.value.map((sensor) => ({
		...sensor,
		displayName: sensor.displayName || '',
		temperatureOffset: sensor.temperatureOffset || 0,
		humidityOffset: sensor.humidityOffset || 0,
		chartYAxisMin: sensor.chartYAxisMin ?? 10,
		chartYAxisMax: sensor.chartYAxisMax ?? 80,
		state: sensor.state || 'offline',
		selected: false,
	}));
	
	sensorStore.setSensors(sensorsWithDefaults);

	// Select the first sensor by default
	if (sensorStore.sensors.length > 0) {
		sensorStore.updateSensor(sensorStore.sensors[0].id, { selected: true });
	}
}

const sensorClick = (sensor) => {
	const selectedSensor = sensorStore.sensors.find((s) => s.selected);

	// If the clicked sensor is already selected, do nothing
	if (selectedSensor && selectedSensor.id === sensor.id) {
		return;
	}

	sensorStore.deselectAllSensors();

	// Select the clicked sensor
	sensorStore.updateSensor(sensor.id, { selected: true });
};
</script>