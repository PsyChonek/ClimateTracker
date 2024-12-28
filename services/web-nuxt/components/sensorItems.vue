<template>
	<div
		class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] justify-items-center gap-4 w-full p-4"
	>
		<slot
			v-for="(item, index) in sensorStore.sensors"
			:key="index"
			:item="item"
		>
			<button
				:class="{ 'bg-purple-950': item.selected }"
				class="flex justify-center items-center p-2 border border-gray-300 w-[180px]"
				@click="sensorClick(item)"
			>
				<p>{{ item.displayName || item.ip }}</p>
			</button>
		</slot>
	</div>
</template>

<script setup>
import { useSensorStore } from '../stores/sensor';

// Access the Pinia store
const sensorStore = useSensorStore();

const sensors = await useAsyncData('sensors', async () => {
	const { $sensorsApi } = useNuxtApp();
	const sensors = await $sensorsApi.allSensorsGet().then((res) => res.data);
	return sensors;
}).data;

// Update the store with the fetched data
sensorStore.setSensors(sensors);

// Sensor click logic
const sensorClick = (sensor) => {
	// Get the currently selected sensor
	const selectedSensor = sensorStore.sensors.find((s) => s.selected);

	// If the clicked sensor is already selected, do nothing
	if (selectedSensor && selectedSensor._id === sensor._id) {
		return;
	}

	sensorStore.deselectAllSensors();

	// Select the clicked sensor
	sensorStore.updateSensor(sensor._id, { selected: true });
};
</script>
