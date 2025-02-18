<template>
  <div class="flex-1 p-4 flex flex-col justify-center items-center">
    <SensorChart class="w-[90vw] max-h-[70vh] text-center flex flex-col items-center mx-auto" :chart-data="chartData" :chart-options="chartOptions" />
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="openModal">Modify Settings</button>
    <SettingsModal :show="showModal" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useNuxtApp, useAsyncData } from '#app';
import SensorChart from '../SensorChart.vue';
import SettingsModal from '../SettingsModal.vue';
import { useReadingStore } from '../stores/reading';

const readingStore = useReadingStore();


// Reactive chart data and options
const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Temperature',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Humidity',
      data: [],
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
  ],
});

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: true,
});

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

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

const setChartData = () => {

  const readings = readingStore.ge
  console.log(readings);

  chartData.labels =  readingStore.readings.map((reading) => reading.timestamp);
  chartData.datasets[0].data = readingStore.readings.map((reading) => reading.temperature);
  chartData.datasets[1].data =  readingStore.readings.map((reading) => reading.humidity);
  
  console.log(chartData);
};

onMounted(() => {
  fetchChartData();
  setChartData();
});
</script>
