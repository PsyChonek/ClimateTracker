<template>
  <div class="flex-1 p-2 flex flex-col justify-center items-center ">
    <SensorChart class="w-full h-full flex-1" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNuxtApp, useAsyncData } from '#app';
import SensorChart from '../SensorChart.vue';
import { useReadingStore } from '../stores/reading';

const readingStore = useReadingStore();

const fetchChartData = async () => {
  const { $readingsApi } = useNuxtApp();
  const { data: readings, error } = await useAsyncData('readings', async () => {
    const response = await $readingsApi.allReadingsGet();
    return response.data;
  });

  if (error.value) {
    console.error('Error fetching chart data:', error.value);
    return;
  }

  readingStore.addAllReadings(readings.value);
};

onMounted(() => {
  fetchChartData();
});
</script>