<template>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] justify-items-center gap-4 w-full p-4">
		<slot v-for="(item, index) in sensorStore.sensors" :key="index" :item="item">
			<button :class="{ 'bg-purple-950': item.selected }" class="flex justify-center items-center p-2 border border-gray-300 w-[180px]" @click="sensorClick(item)">
				<p>{{ item.displayName || item.espID }}</p>
			</button>
		</slot>

		<!-- Show warning if API not available -->
		<div v-if="error" class="text-red-500">Error fetching sensors</div>
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
