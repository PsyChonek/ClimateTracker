<template>
	<div class="flex flex-col justify-between items-center p-4 px-8 bg-black">
		<h1 class="text-white text-xl font-bold whitespace-nowrap">
			Climate Tracker
		</h1>
		<SensorItems :items="items" />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import SensorItems from '../SensorItems.vue';
const items = ref([]);

onServerPrefetch(async () => {
	const { $sensorsApi } = useNuxtApp(); // Access the injected client
	$sensorsApi.allSensorsGet((err, data) => {
		if (err) {
			console.error('Error fetching sensors:', err);
			return;
		}
		console.log('Fetched sensors:', data);
	});
});
</script>
