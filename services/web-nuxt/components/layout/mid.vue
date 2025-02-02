<template>
	<div class="flex-1 p-4 flex flex-col justify-center items-center">
		<SensorChart
			class="w-[90vw] max-h-[70vh] text-center flex flex-col items-center mx-auto"
			:chart-data="chartData"
			:chart-options="chartOptions"
		/>
	</div>
</template>

<script setup>
import SensorChart from '../sensorChart.vue';

// Reactive chart data and options
const chartData = reactive({
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [
		{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
			borderWidth: 1,
		},
	],
});

const chartOptions = reactive({
	responsive: true,
	maintainAspectRatio: true,
});
</script>
