<template>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<div class="p-2 bg-gray-800 rounded-lg shadow-md w-full">
			<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] justify-items-center gap-4 w-full">
				<slot v-for="(item, index) in sensorStore.sensors" :key="index" :item="item">
					<button :class="{ 'bg-purple-900': item.selected }" class="flex justify-center items-center p-2 border border-gray-300 w-[180px] rounded-lg shadow-md hover:bg-purple-800 transition-colors duration-300" @click="sensorClick(item)">
						<p class="text-white font-bold">{{ item.displayName || item.espID }}</p>
					</button>
				</slot>

				<!-- Show warning if API not available -->
				<div v-if="error" class="text-red-500">Error fetching sensors</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useSensorStore } from '../stores/sensor';

const sensorStore = useSensorStore();

const { data: sensors, error } = await useAsyncData('sensors', async () => {
	const { $sensorsApi } = useNuxtApp();
	const response = await $sensorsApi.allSensorsGet();
	return response.data;
});

if (error.value) {
	console.error("Error fetching sensors:", error.value);
} else if (sensors.value) {
	sensorStore.setSensors(sensors.value);

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
