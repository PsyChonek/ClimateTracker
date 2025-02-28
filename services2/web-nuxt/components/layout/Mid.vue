<template>
  <div class="flex-1 p-2 flex flex-col justify-center items-center ">
    <SensorChart class="w-full h-full flex-1" />
    <button :class="{ 'bg-purple-900': true }" class="flex justify-center items-center mt-4 px-4 py-2 text-white rounded-lg shadow-md hover:bg-purple-800 transition-colors duration-300" @click="openModal">
      Modify Settings
    </button>
    <SettingsModal :show="showModal" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, useAsyncData } from '#app';
import SensorChart from '../SensorChart.vue';
import SettingsModal from '../SettingsModal.vue';
import { useReadingStore } from '../stores/reading';

const readingStore = useReadingStore();

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

onMounted(() => {
  fetchChartData();
});
</script>