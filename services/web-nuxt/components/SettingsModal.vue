<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
    <div class="bg-gray-800 p-4 rounded shadow-lg w-2/3 text-center p-8">
      <h2 class="text-xl mb-4 text-white">Modify Settings</h2>
      <form @submit.prevent="updateSettings">
        <div class="mb-4">
          <label class="block text-gray-300">Select Sensor</label>
          <select v-model="selectedSensorId" class="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white" @change="fetchSettings">
            <option v-for="sensor in sensors" :key="sensor._id" :value="sensor._id">{{ sensor.displayName || sensor.ip }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-300">Display Name</label>
          <input v-model="settings.displayName" type="text" class="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white" >
        </div>
        <div class="mb-4">
          <label class="block text-gray-300">Temperature Offset</label>
          <input v-model="settings.temperatureOffset" type="number" class="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white" >
        </div>
        <div class="mb-4">
          <label class="block text-gray-300">Humidity Offset</label>
          <input v-model="settings.humidityOffset" type="number" class="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white" >
        </div>
        <div class="flex justify-end">
          <button type="button" class="mr-2 px-4 py-2 bg-gray-600 text-white rounded" @click="closeModal">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
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
});

const selectedSensorId = ref('');
const sensorStore = useSensorStore();
const sensors = ref([]);

const fetchSensors = () => {
  sensors.value = sensorStore.sensors;
  if (sensors.value.length > 0) {
    selectedSensorId.value = sensors.value[0]._id;
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
    };
  } else {
    console.error('Sensor not found');
  }
};

const updateSettings = async () => {
  try {
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

<style scoped>
/* Add your styles here */
</style>
