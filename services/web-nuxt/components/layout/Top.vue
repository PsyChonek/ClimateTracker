<template>
	<div class="flex flex-col justify-between items-center p-4 px-8 bg-black">
		<h1 class="text-white text-xl font-bold whitespace-nowrap">Climate Tracker</h1>
		<SensorItems :items="items" />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SensorItems from '../SensorItems.vue';

const items = ref([]);

onMounted(() => {
	items.value = [
		{ name: 'Sensor A', status: 'active' },
		{ name: 'Sensor B', status: 'inactive' },
		{ name: 'Sensor C', status: 'active' },
		{ name: 'Sensor D', status: 'active' }
	];
});
</script>