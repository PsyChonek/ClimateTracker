<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-1 gap-2">
    <div class="bg-gray-800 p-4 rounded-lg shadow-md min-w-2/3 text-center">
      <h2 class="text-xl mb-4 text-white">Modify Settings</h2>
      <form @submit.prevent="updateSettings">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-center gap-2">
            <label class="w-1/2 text-lg font-bold text-gray-300 text-left">Select Sensor</label>
            <select v-model="selectedSensorId" class="w-2/3 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10" @change="fetchSettings">
              <option v-for="sensor in sensors" :key="sensor.id" :value="sensor.id">{{ sensor.displayName || sensor.espID }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <label class="w-1/2 text-lg font-bold text-gray-300 text-left">Display Name</label>
            <input v-model="settings.displayName" type="text" class="w-2/3 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10">
          </div>
          <div class="flex items-center gap-2">
            <label class="w-1/2 text-lg font-bold text-gray-300 text-left">Temperature Offset</label>
            <input v-model="settings.temperatureOffset" type="number" class="w-2/3 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10">
          </div>
          <div class="flex items-center gap-2">
            <label class="w-1/2 text-lg font-bold text-gray-300 text-left">Humidity Offset</label>
            <input v-model="settings.humidityOffset" type="number" class="w-2/3 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10">
          </div>
          <div class="flex items-center gap-2">
            <label class="w-1/2 text-lg font-bold text-gray-300 text-left">Chart Y-Axis Min</label>
            <input v-model="settings.chartYAxisMin" type="number" class="w-2/3 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10">
          </div>
          <div class="flex items-center gap-2">
            <label class="w-1/2 text-lg font-bold text-gray-300 text-left">Chart Y-Axis Max</label>
            <input v-model="settings.chartYAxisMax" type="number" class="w-2/3 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10">
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button type="button" class="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md" @click="closeModal">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSensorStore } from '../stores/sensor';

const props = defineProps({
  show: Boolean,
  onClose: {
    type: Function,
    default: () => {},
  },
});

const settings = ref({
  displayName: '',
  temperatureOffset: 0,
  humidityOffset: 0,
  chartYAxisMin: 10,
  chartYAxisMax: 80,
});

const selectedSensorId = ref('');
const sensorStore = useSensorStore();
const sensors = ref([]);

const fetchSensors = () => {
  sensors.value = sensorStore.sensors;
  if (sensors.value.length > 0) {
    selectedSensorId.value = sensorStore.getSelectedSensors().id;
    fetchSettings();
  }
};

const fetchSettings = () => {
  const sensor = sensorStore.getSensorById(selectedSensorId.value);
  if (sensor) {
    settings.value = {
      displayName: sensor.displayName || '',
      temperatureOffset: sensor.temperatureOffset || 0,
      humidityOffset: sensor.humidityOffset || 0,
      chartYAxisMin: sensor.chartYAxisMin ?? 10,
      chartYAxisMax: sensor.chartYAxisMax ?? 80,
    };
  } else {
    console.error('Sensor not found');
  }
};

const updateSettings = async () => {
  try {
    const sensorsApi = useSensorsApi();
    const request = {
      displayName: settings.value.displayName,
      temperatureOffset: settings.value.temperatureOffset,
      humidityOffset: settings.value.humidityOffset,
      chartYAxisMin: settings.value.chartYAxisMin,
      chartYAxisMax: settings.value.chartYAxisMax,
    };
    console.log('Updating sensor settings:', request);
    await sensorsApi.updateSensor(selectedSensorId.value, request);
    sensorStore.updateSensor(selectedSensorId.value, settings.value);
    props.onClose();
  } catch (error) {
    console.error('Error updating sensor settings:', error);
  }
};

const closeModal = () => {
  props.onClose();
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchSensors();
  }
});
</script>