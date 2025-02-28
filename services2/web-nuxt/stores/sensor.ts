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
			const sensorIndex = this.sensors.findIndex((sensor) => sensor.id === id);
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
		getSensorById(id: string): Sensor | undefined {
			return this.sensors.find((sensor) => sensor.id === id);
		},
		getSelectedSensors(): Sensor {
			return this.sensors.filter((sensor) => sensor.selected)[0];
		},
	},
});
