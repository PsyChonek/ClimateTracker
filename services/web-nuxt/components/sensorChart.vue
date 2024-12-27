<template>
	<div>
		<Bar ref="chartRef" :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Bar } from 'vue-chartjs';

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

// Create a ref for the chart
const chartRef = ref(null);

onMounted(() => {
	const handleResize = () => {
		if (chartRef.value?.chart) {
			chartRef.value.chart.resize();
		}
	};

	window.addEventListener('resize', handleResize);

	// Cleanup on component unmount
	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize);
	});
});
</script>
