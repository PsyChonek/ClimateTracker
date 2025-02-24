<template>
	<div>
		<Line ref="chartRef" :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useReadingStore } from '../stores/reading';
import { useSensorStore } from '~/stores/sensor';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)


defineProps({
});

// Create a ref for the chart
const chartRef = ref(null);

const readingStore = useReadingStore();
const sensorStore = useSensorStore();

const chartData = ref({
	labels: [],
	datasets: [
		{
			label: "Temperature °C",
			data: [],
			fill: true,
			borderColor: "rgb(255, 99, 132)",
			tension: 0.1,
		},
		{
			label: "Humidity %",
			data: [],
			fill: true,
			borderColor: "rgb(75, 192, 255)",
			tension: 0.1,
		},
	],
});

const labelAngle = 45;

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
	animation: {
		duration: 500,
	},
	plugins: {
		datalabels: {
			display: true,
			color: function (context) {
				return context.dataset.label === "Temperature °C" ? "rgb(255, 99, 132)" : "rgb(75, 192, 255)";
			},
			anchor: "end",
			align: "top",
			offset: 4, // You can adjust the offset of the labels
			formatter: function (value, context) {
				return context.dataset.label === "Temperature °C" ? value.toFixed(1) + " °C" : value.toFixed(0) + " %";
			},
			rotation: labelAngle,
		},
		legend: {
			display: true,
			position: "bottom",
			title: {
				display: true,
				padding: 10,
			},
		},
		afterLayout: function (chart) {
			const ctx = chart.ctx;
			const dataset = chart.data.datasets[0];
			const meta = chart.getDatasetMeta(0);

			meta.data.forEach(function (element, index) {
				const model = element._model;
				const textWidth = ctx.measureText(dataset.data[index].toString()).width;

				// Adjust rotation based on available space
				if (model.x + textWidth > chart.width) {
					model.rotation = Math.PI / 2; // Rotate 90 degrees
				} else {
					model.rotation = 0; // No rotation
				}
			});
		},
	},
	scales: {
		y: {
			beginAtZero: true,
			grid: {
				display: true,
				color: "rgba(155, 155, 155, 0.1)",
			},
			max: 100,
			offset: false, // add space to the end of the chart
		},
		x: {
			offset: false, // add space to the end of the chart
			grid: {
				display: true,
				color: "rgba(155, 155, 155, 0.1)",
			},
		},
	},
	labels: {
		padding: 10,
	}
});

const setChartData = () => {

	const selectedSensor = sensorStore.getSelectedSensors();

	if (!selectedSensor) {
		return;
	}

	const dateFrom = new Date();
	dateFrom.setDate(dateFrom.getDate() - 8);
	const dateTo = new Date();

	const readings = readingStore.readings.filter((reading) => {
		const readingDate = new Date(reading.timestamp);
		return readingDate >= dateFrom && readingDate <= dateTo && reading.espID === selectedSensor.espID;
	});

	const newLabels = readings.map((reading) =>
		new Date(reading.timestamp).toLocaleString()
	);
	const newTemperatureData = readings.map((reading) => reading.temperature);
	const newHumidityData = readings.map((reading) => reading.humidity);

	// Replace the entire object to trigger reactivity
	chartData.value = {
		labels: newLabels,
		datasets: [
			{
				label: "Temperature °C",
				data: newTemperatureData,
				fill: true,
				borderColor: "rgb(255, 99, 132)",
				tension: 0.1,
			},
			{
				label: "Humidity %",
				data: newHumidityData,
				fill: true,
				borderColor: "rgb(75, 192, 255)",
				tension: 0.1,
			},
		],
	};

	if (chartRef.value?.chart) {
		chartRef.value.chart.update();
	}
};

readingStore.$subscribe(() => {
	console.log('Reading store updated');
	setChartData();
});

sensorStore.$subscribe(() => {
	console.log('Sensor store updated');
	setChartData();
});

onMounted(() => {
	setChartData();

	const handleResize = () => {
		if (chartRef.value?.chart) {
			chartRef.value.chart.resize();
		}

		// Redraw the chart
		if (chartRef.value?.chart) {
			chartRef.value.chart.update();
		}
	};

	window.addEventListener('resize', handleResize);

	// Cleanup on component unmount
	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize);
	});
});
</script>
