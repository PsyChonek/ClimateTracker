<template>
	<div class="top">
		<h1 class="title">Climate Tracker</h1>
		<SensorItems :items="items" />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SensorItems from './SensorItems.vue';

const items = ref([]);

onMounted(() => {
	items.value = [
		{ name: 'Sensor A', status: 'active' },
		{ name: 'Sensor B', status: 'inactive' },
		{ name: 'Sensor C', status: 'active' },
		{ name: 'Sensor D', status: 'active' },
		{ name: 'Sensor E', status: 'active' },
		{ name: 'Sensor F', status: 'active' },
		{ name: 'Sensor G', status: 'active' },
		{ name: 'Sensor H', status: 'active' },
		{ name: 'Sensor I', status: 'active' },
	];
});
</script>

<style scoped>
.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	padding-left: 2rem;
	padding-right: 2rem;
	background-color: black;
	flex-direction: column;
}

.title {
	font-size: 1.5rem;
	font-weight: bold;
	color: white;
	word-wrap: none;
	word-break: keep-all;
	white-space: nowrap;
}
</style>
