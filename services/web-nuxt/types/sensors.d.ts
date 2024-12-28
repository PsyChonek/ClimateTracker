export interface Sensor {
	_id: string;
	ip: string;
	espId: string;
	displayName: string;
	temperatureOffset: number;
	humidityOffset: number;
	state: 'online' | 'offline';
	selected: boolean;
}
