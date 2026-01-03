export interface Sensor {
	id: string;
	ip: string;
	espID: string;
	displayName: string;
	temperatureOffset: number;
	humidityOffset: number;
	chartYAxisMin: number;
	chartYAxisMax: number;
	state: 'online' | 'offline';
	selected: boolean;
}
