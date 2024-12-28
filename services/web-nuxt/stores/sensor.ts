import { defineStore } from 'pinia';
import type { Sensor } from '../types/sensors';

export const useSensorStore = defineStore('sensor', {
	state: () => ({
		sensors: [] as Sensor[],
	}),
	actions: {
		setSensors(sensors: Sensor[]) {
			this.sensors = sensors;
		},
		updateSensor(id: string, updatedSensor: Partial<Sensor>) {
			const sensorIndex = this.sensors.findIndex((sensor) => sensor._id === id);
			if (sensorIndex !== -1) {
				this.sensors[sensorIndex] = {
					...this.sensors[sensorIndex],
					...updatedSensor,
				};
			} else {
				console.warn(`Sensor with ID ${id} not found.`);
			}
		},
		deselectAllSensors() {
			this.sensors.forEach((sensor) => (sensor.selected = false));
		},
	},
});
