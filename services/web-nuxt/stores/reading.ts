import { defineStore } from 'pinia';
import type { Reading } from '../types/reading';

export const useReadingStore = defineStore('reading', {
	state: () => ({
		readings: [] as Reading[],
	}),
	actions: {
		addReading(reading: Reading) {
			const existingReading = this.readings.find(
				(r) => r.timestamp === reading.timestamp && r.espID === reading.espID
			);
			if (existingReading) {
				existingReading.timestamp = reading.timestamp;
			} else {
				this.readings.push(reading);
			}
		},
		removeReading(timestamp: string, espID: string) {
			this.readings = this.readings.filter(
				(reading) => reading.timestamp !== timestamp || reading.espID !== espID
			);
		},
		updateReading(updatedReading: Reading) {
			const index = this.readings.findIndex(
				(reading) =>
					reading.timestamp === updatedReading.timestamp &&
					reading.espID === updatedReading.espID
			);
			if (index !== -1) {
				this.readings[index] = updatedReading;
			}
		},
		addAllReadings(readings: Reading[]) {
			this.readings = readings;
		},
        getAllReadings() {
            return this.readings;
        },
		getReadingByTimestampAndEspID(timestamp: string, espID: string) {
			return this.readings.find(
				(reading) => reading.timestamp === timestamp && reading.espID === espID
			);
		},
	},
});
