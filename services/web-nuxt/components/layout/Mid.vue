<template>
  <div class="flex-1 p-2 flex flex-col justify-center items-center ">
    <SensorChart class="w-full h-full flex-1" />
  </div>
</template>

<script setup>
import SensorChart from '../SensorChart.vue';
import { useReadingStore } from '../stores/reading';

const readingStore = useReadingStore();
const readingsApi = useReadingsApi();

// Fetch readings using useAsyncData at the top level
const { data: readings, error } = await useAsyncData('readings', async () => {
  return await readingsApi.getAllReadings();
});

if (error.value) {
  console.error('Error fetching chart data:', error.value);
} else if (readings.value) {
  readingStore.addAllReadings(readings.value);
}
</script>