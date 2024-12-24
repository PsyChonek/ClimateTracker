<template>
	<div>
		<Bar :data="chartData" :options="chartOptions"/>
	</div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { defineProps } from 'vue';

defineProps({
	chartData: {
		type: Object,
		required: true,
	},
	chartOptions: {
		type: Object,
		required: true,
	},
});
</script>
