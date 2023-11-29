const HOW_MANY_SHOW = 9;
const SECONDS_TO_DISCONNECT = 30;

if (!!window.EventSource) {
	console.log("Start event source!");
	var source = new EventSource("/events");
}

source.addEventListener(
	"newReadings",
	function (e) {
		console.log("newReadings ", e.data);
		newReading(JSON.parse(e.data));
	},
	false
);

var wifiData;
source.addEventListener(
	"newWifiStatus",
	function (e) {
		console.log("newWifiStatus ", e.data);
		wifiData = JSON.parse(e.data);
		wifiData.timeStamp = new Date().getTime();
	},
	false
);

var lastCheckedTimeStamp;
setInterval(() => {
	if (!source) return;
	if (!wifiData) return;

	var lastUpdatedSeconds = (new Date().getTime() - wifiData.timeStamp) / 1000;

	if (lastCheckedTimeStamp === wifiData.timeStamp && lastUpdatedSeconds > SECONDS_TO_DISCONNECT) {
		console.log("No new data");
		wifiData.status = "disconnected";
	}

	lastCheckedTimeStamp = wifiData.timeStamp;

	if (source.readyState === EventSource.CLOSED) {
		console.log("Reconnect");
		source = new EventSource("/events");
		wifiData.status = "disconnected";
	}

	if (wifiData.status === "connected") {
		document.getElementById("wifiStatus").innerHTML = "Online" + " " + wifiData.wifiSignalStrength + " RSSI" + " " + lastUpdatedSeconds.toFixed(0) + "s ago";
		document.getElementById("wifiStatus").style.color = lastUpdatedSeconds > SECONDS_TO_DISCONNECT / 2 ? "orange" : "green";
	} else {
		document.getElementById("wifiStatus").innerHTML = "Offline";
		document.getElementById("wifiStatus").style.color = "red";
	}
}, 1000);

function newReading(data) {
	readings.push({
		temperature: data.temperature,
		humidity: data.humidity,
		timestamp: data.timestamp,
	});

	// Remove old data
	if (chart.data.labels.length >= HOW_MANY_SHOW) {
		// Remove first element
		chart.data.labels.shift();
		chart.data.datasets[0].data.shift();
		chart.data.datasets[1].data.shift();
		chart.update();
	}

	// Add new data
	chart.data.labels.push(getDateFormat(new Date(readings[readings.length - 1].timestamp * 1000)));
	chart.data.datasets[0].data.push(readings[readings.length - 1].temperature);
	chart.data.datasets[1].data.push(readings[readings.length - 1].humidity);
	chart.update();
}

var readings = [];

const data = {
	labels: readings.map((r) => {
		return getDateFormat(new Date(r.timestamp * 1000));
	}),
	datasets: [
		{
			label: "Temperature °C",
			data: readings.map((r) => r.temperature),
			fill: true,
			borderColor: "rgb(255, 99, 132)",
			tension: 0.1,
		},
		{
			label: "Humidity %",
			data: readings.map((r) => r.humidity),
			fill: true,
			borderColor: "rgb(75, 192, 255)",
			tension: 0.1,
		},
	],
};

const chartCanvas = document.getElementById("myChart").getContext("2d");
Chart.defaults.font.size = 18;
Chart.defaults.font.family = "sans-serif";
Chart.register(ChartDataLabels);

const chart = new Chart(chartCanvas, {
	type: "line",
	data: data,
	options: {
		layout: {
			padding: 20,
		},
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			duration: 500,
		},
		plugins: {
			datalabels: {
				display: "auto",
				color: function (context) {
					return context.dataset.label === "Temperature °C" ? "rgb(255, 99, 132)" : "rgb(75, 192, 255)";
				},
				anchor: "end",
				align: "top",
				offset: 4, // You can adjust the offset of the labels
				formatter: function (value, context) {
					return context.dataset.label === "Temperature °C" ? value.toFixed(2) + " °C" : value.toFixed(2) + " %";
				},
			},
			legend: {
				display: true,
				position: 'bottom',
				title: {
				  display: true,
				  padding: 10,
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					display: true,
					color: "rgba(155, 155, 155, 0.1)",
				},
				max: 100,
			},
			x: {
				offset: true, // add space to the end of the chart
				grid: {
					display: true,
					color: "rgba(155, 155, 155, 0.1)",
				},
			},
		},
		labels: {
			padding: 10,
		},
	},
});

// HH:MM - 15:20
function getDateFormat(date) {
	return `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}
