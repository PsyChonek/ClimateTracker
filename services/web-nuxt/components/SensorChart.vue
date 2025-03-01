<template>
  <div class="w-full h-full flex flex-col justify-center items-center p-1 gap-2">
    <!-- Settings for what is shown on the chart -->
    <div class="p-2 bg-gray-800 rounded-lg shadow-md w-full relative">
      <details class="w-full">
        <summary class="text-gray-300 cursor-pointer">Chart Settings</summary>
        <div class="absolute z-10 left-0 right-0 bg-gray-800 p-2 rounded-b-lg shadow-lg border border-gray-700 mt-1">
          <div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            <div class="flex flex-col">
              <label for="howManyShow" class="mb-1 text-xs font-medium text-gray-300">Show</label>
              <input v-model="filters.howManyShow" type="number" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10" placeholder="10" min="1" max="1000" >
            </div>
            <div class="flex flex-col">
              <label for="howManySkip" class="mb-1 text-xs font-medium text-gray-300">Skip</label>
              <input v-model="filters.howManySkip" type="number" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10" placeholder="0" min="1" max="1000" >
            </div>
            <div class="flex flex-col">
              <label for="labelAngle" class="mb-1 text-xs font-medium text-gray-300">Angle</label>
              <input v-model="filters.labelAngle" type="number" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10" placeholder="45" min="0" max="90" >
            </div>
            <div class="flex flex-col">
              <label for="labelOffset" class="mb-1 text-xs font-medium text-gray-300">Count</label>
              <input v-model="filters.dataCount" type="text" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10" disabled >
            </div>
            <div class="flex flex-col">
              <label class="mb-1 text-xs font-medium text-gray-300">Date Range</label>
              <div class="flex space-x-1">
                <input v-model="filters.dateFrom" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10 w-full" type="date" >
                <input v-model="filters.dateTo" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10 w-full" type="date" >
              </div>
            </div>
            <div class="flex flex-col ">
              <label class="mb-1 text-xs font-medium text-gray-300">Time Range</label>
              <div class="flex space-x-1">
                <input v-model="filters.timeFrom" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10 w-full" type="time" >
                <input v-model="filters.timeTo" class="p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-300 h-10 w-full" type="time" >
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
    <div class="p-2 bg-gray-800 rounded-lg shadow-md w-full h-full flex-1">
      <Line ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Line } from "vue-chartjs";
import { ref, onMounted, watch } from "vue";
import { useReadingStore } from "../stores/reading";
import { useSensorStore } from "~/stores/sensor";
import datalabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  datalabels
);

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

// Calculate default date range (last 30 days)
const today = new Date();
const todayString = today.toISOString().substring(0, 10);

// Function to load filters from localStorage
const loadFilters = () => {
  let storedFilters = null;
  if (import.meta.client) {
    storedFilters = localStorage.getItem("chartFilters");
  }
  const defaultFilters = {
    howManyShow: 10,
    howManySkip: 0,
    labelAngle: 45,
    dataCount: 0,
    dateFrom: todayString,
    dateTo: todayString,
    timeFrom: "00:00",
    timeTo: "23:59",
  };

  if (storedFilters) {
    try {
      const parsedFilters = JSON.parse(storedFilters);
      return {
        ...defaultFilters,
        howManyShow: parsedFilters.howManyShow || defaultFilters.howManyShow,
        howManySkip: parsedFilters.howManySkip || defaultFilters.howManySkip,
        labelAngle: parsedFilters.labelAngle || defaultFilters.labelAngle,
        timeFrom: parsedFilters.timeFrom || defaultFilters.timeFrom,
        timeTo: parsedFilters.timeTo || defaultFilters.timeTo,
        dateFrom: todayString,
        dateTo: todayString,
      };
    } catch (error) {
      console.error("Error parsing stored filters:", error);
      return defaultFilters;
    }
  } else {
    return defaultFilters;
  }
};

// Function to save filters to localStorage
const saveFilters = (filters) => {
  if (import.meta.client) {
    const { dateFrom, dateTo, ...filtersToSave } = filters;
    localStorage.setItem("chartFilters", JSON.stringify(filtersToSave));
  }
};

const filters = ref(loadFilters());

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
        return context.dataset.label === "Temperature °C"
          ? "rgb(255, 99, 132)"
          : "rgb(75, 192, 255)";
      },
      anchor: "end",
      align: "top",
      offset: 4,
      formatter: function (value, context) {
        return context.dataset.label === "Temperature °C"
          ? value.toFixed(1) + " °C"
          : value.toFixed(0) + " %";
      },
      rotation: function () {
        return filters.value.labelAngle * -1;
      },
    },
    legend: {
      display: true,
      position: "bottom",
      labels: {
        color: "#D1D5DB",
      },
    },
    tooltip: {
      callbacks: {
        labelColor: function (context) {
          return {
            borderColor: "#D1D5DB",
            backgroundColor: context.dataset.borderColor,
          };
        },
        labelTextColor: function () {
          return "#D1D5DB";
        },
      },
    },
    afterLayout: function (chart) {
      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach(function (element, index) {
        const model = element._model;
        const textWidth = ctx.measureText(dataset.data[index].toString())
          .width;

        if (model.x + textWidth > chart.width) {
          model.rotation = Math.PI / 2;
        } else {
          model.rotation = 0;
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
      ticks: {
        color: "#D1D5DB",
      },
      max: 80,
      min: 10,
      offset: false,
    },
    x: {
      offset: false,
      grid: {
        display: true,
        color: "rgba(155, 155, 155, 0.1)",
      },
      ticks: {
        color: "#D1D5DB",
      },
    },
  },
  labels: {
    padding: 10,
  },
});

const setChartData = () => {
  const selectedSensor = sensorStore.getSelectedSensors();

  if (!selectedSensor) {
    return;
  }

  const dateFrom = new Date(
    filters.value.dateFrom + "T" + filters.value.timeFrom
  );
  const dateTo = new Date(filters.value.dateTo + "T" + filters.value.timeTo);

  const readings = readingStore.readings.filter((reading) => {
    const readingDate = new Date(reading.timestamp);
    return (
      readingDate >= dateFrom &&
      readingDate <= dateTo &&
      reading.espID === selectedSensor.espID
    );
  });

  // Calculate the total count of readings within the time range
  filters.value.dataCount = readings.length;

  const skippedReadings = readings.filter(
    (_, index) => index % (filters.value.howManySkip + 1) === 0
  );

  // Ensure the last element is always included
  if (skippedReadings.length > 0 && readings.length > 0) {
    const lastReading = readings[readings.length - 1];
    const lastSkippedReading = skippedReadings[skippedReadings.length - 1];

    // Check if the last reading is already in skippedReadings
    if (lastSkippedReading.timestamp !== lastReading.timestamp) {
      skippedReadings.push(lastReading);
    }
  }

  const limitedReadings = skippedReadings.slice(0, filters.value.howManyShow);

  // Check if all readings are from the same day
  const allSameDay = limitedReadings.every((reading) => {
    const readingDate = new Date(reading.timestamp);
    return (
      readingDate.toDateString() ===
      new Date(limitedReadings[0].timestamp).toDateString()
    );
  });

  const newLabels = limitedReadings.map((reading) =>
    new Date(reading.timestamp).toLocaleString("cz-CS", {
      hour12: false,
      year: allSameDay ? undefined : "numeric",
      month: allSameDay ? undefined : "2-digit",
      day: allSameDay ? undefined : "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const newTemperatureData = limitedReadings.map(
    (reading) => reading.temperature
  );
  const newHumidityData = limitedReadings.map((reading) => reading.humidity);

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

watch(
  filters,
  (newFilters) => {
    saveFilters(newFilters); // Save filters to localStorage on change
    setChartData();
  },
  { deep: true }
);

readingStore.$subscribe(() => {
  console.log("Reading store updated");
  setChartData();
});

sensorStore.$subscribe(() => {
  console.log("Sensor store updated");
  setChartData();
});

onMounted(() => {
  setChartData();
});
</script>
