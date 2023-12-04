var howManyShow = 0;
var howManySkip = 0;
var labelAngle = 0;
const SECONDS_TO_DISCONNECT = 30;

var inputHowManyShow = document.getElementById("howManyShow");
inputHowManyShow.addEventListener("change", (e) => {
	howManyShow = e.target.value;
	updateChart();
	storeSettings();
});

howManyShow = inputHowManyShow.value;

var dateFrom = document.getElementById("dateFrom");
var dateTo = document.getElementById("dateTo");

dateFrom.value = new Date().toISOString().split("T")[0];
dateTo.value = new Date().toISOString().split("T")[0];

dateFrom.addEventListener("change", (e) => {
	console.log("dateFrom", e.target.value);
	updateChart();
});

dateTo.addEventListener("change", (e) => {
	console.log("dateTo", e.target.value);
	updateChart();
});

var timeFrom = document.getElementById("timeFrom");
var timeTo = document.getElementById("timeTo");

timeFrom.addEventListener("change", (e) => {
	console.log("timeFrom", e.target.value);
	updateChart();
});

timeTo.addEventListener("change", (e) => {
	console.log("timeTo", e.target.value);
	updateChart();
});

var inputHowManySkip = document.getElementById("howManySkip");
inputHowManySkip.addEventListener("change", (e) => {
	howManySkip = e.target.value;
	updateChart();
	storeSettings();
});

howManySkip = inputHowManySkip.value;

var inputLabelAngle = document.getElementById("labelAngle");
inputLabelAngle.addEventListener("change", (e) => {
	labelAngle = e.target.value * -1;
	chart.options.plugins.datalabels.rotation = labelAngle;
	updateChart();
	storeSettings();
});

labelAngle = -inputLabelAngle.value;

var dataCount = document.getElementById("dataCount");

var allReadings = [];
var filteredReadings = [];

if (!!window.EventSource) {
	console.log("Start event source!");
	var source = new EventSource("/events");
}

source.addEventListener(
	"newReading",
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

source.addEventListener(
	"allReadings",
	function (e) {
		var data = JSON.parse(e.data);
		console.log("Readings received", data.data.length);
		// Add into allReadings if timestamp is not in allReadings
		data.data.forEach((r) => {
			if (!allReadings.find((ar) => ar.timestamp === r.timestamp)) {
				allReadings.push(r);
			}
		});
		orderData();
		updateChart();
		updateDataCount();
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

function orderData() {
	filteredReadings.sort((a, b) => {
		return a.timestamp - b.timestamp;
	});
}

function filterData() {
	var dateFromValue = new Date(dateFrom.value);
	dateFromValue = new Date(dateFromValue.getTime() + dateFromValue.getTimezoneOffset() * 60 * 1000);
	var dateToValue = new Date(dateTo.value);
	dateToValue = new Date(dateToValue.getTime() + dateToValue.getTimezoneOffset() * 60 * 1000);

	var timeFromValue = timeFrom.value.split(":");
	var timeToValue = timeTo.value.split(":");

	var timeFromValueInSeconds = parseInt(timeFromValue[0]) * 60 * 60 + parseInt(timeFromValue[1]) * 60;
	var timeToValueInSeconds = parseInt(timeToValue[0]) * 60 * 60 + parseInt(timeToValue[1]) * 60;

	var dateTimeFromValue = dateFromValue.getTime() + timeFromValueInSeconds * 1000;
	var dateTimeToValue = dateToValue.getTime() + timeToValueInSeconds * 1000;

	// Filter dateTime
	filteredReadings = allReadings.filter((r) => {
		return r.timestamp * 1000 >= dateTimeFromValue && r.timestamp * 1000 <= dateTimeToValue;
	});

	// Filter howManySkip always show first and last
	filteredReadings = filteredReadings.filter((r, index) => {
		return index % (parseInt(howManySkip) + 1) === 0 || index === filteredReadings.length - 1;
	});
}

// Load only last HOW_MANY_SHOW readings
function updateChart() {
	clearChart();
	filterData();

	for (let i = filteredReadings.length - howManyShow - 1; i < filteredReadings.length; i++) {
		if (!filteredReadings[i]) continue;
		addToChart(filteredReadings[i]);
	}
}

function addToChart(reading) {
	// Remove old data
	if (chart.data.labels.length >= howManyShow) {
		// Remove first element
		chart.data.labels.shift();
		chart.data.datasets[0].data.shift();
		chart.data.datasets[1].data.shift();
		chart.update();
	}

	// Add new data
	chart.data.labels.push(getDateFormat(new Date(reading.timestamp * 1000)));
	chart.data.datasets[0].data.push(reading.temperature);
	chart.data.datasets[1].data.push(reading.humidity);
	chart.update();
}

function newReading(data) {
	var reading = {
		temperature: data.temperature,
		humidity: data.humidity,
		timestamp: data.timestamp,
	};

	allReadings.push(reading);
	updateDataCount();
	addToChart(reading);
}

const data = {
	labels: filteredReadings.map((r) => {
		return getDateFormat(new Date(r.timestamp * 1000));
	}),
	datasets: [
		{
			label: "Temperature °C",
			data: filteredReadings.map((r) => r.temperature),
			fill: true,
			borderColor: "rgb(255, 99, 132)",
			tension: 0.1,
		},
		{
			label: "Humidity %",
			data: filteredReadings.map((r) => r.humidity),
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
				display: true,
				color: function (context) {
					return context.dataset.label === "Temperature °C" ? "rgb(255, 99, 132)" : "rgb(75, 192, 255)";
				},
				anchor: "end",
				align: "top",
				offset: 4, // You can adjust the offset of the labels
				formatter: function (value, context) {
					return context.dataset.label === "Temperature °C" ? value.toFixed(1) + " °C" : value.toFixed(0) + " %";
				},
				rotation: labelAngle,
			},
			legend: {
				display: true,
				position: "bottom",
				title: {
					display: true,
					padding: 10,
				},
			},
			afterLayout: function (chart) {
				var ctx = chart.ctx;
				var dataset = chart.data.datasets[0];
				var meta = chart.getDatasetMeta(0);
				var data = dataset.data;

				meta.data.forEach(function (element, index) {
					var model = element._model;
					var textWidth = ctx.measureText(dataset.data[index].toString()).width;

					// Adjust rotation based on available space
					if (model.x + textWidth > chart.width) {
						model.rotation = Math.PI / 2; // Rotate 90 degrees
					} else {
						model.rotation = 0; // No rotation
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
				max: 100,
				offset: false, // add space to the end of the chart
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

function exportDataToConsole() {
	console.log(allReadings);
}

function importDataFromConsole(data) {
	allReadings = data;
	orderData();
	updateChart();
	updateDataCount();
}

function clearData() {
	allReadings = [];
	clearChart();
}

function clearChart() {
	chart.data.labels = [];
	chart.data.datasets[0].data = [];
	chart.data.datasets[1].data = [];
	chart.update();
}

function updateDataCount() {
	if (allReadings.length > 9999) {
		dataCount.innerHTML = allReadings.length / 1000 + "k";
		return;
	}

	dataCount.innerHTML = allReadings.length;
}

// Load file from /readings.txt and import data
function loadFromFile() {
	fetch("/readings.txt")
		.then((response) => response.text())
		.then((text) => {
			var data = text.split("\n");
			data.forEach((d) => {
				if (!d) return;
				try {
					var reading = JSON.parse(d);
					allReadings.push(reading);
				}
				catch (e) {
					console.log("Error parsing reading", e);
					console.log("Reading", d);
				}
			});

			orderData();
			updateChart();
			updateDataCount();
		});
}

// Store settings to local storage
function storeSettings() {
	var settings = {
		howManyShow: howManyShow,
		howManySkip: howManySkip,
		labelAngle: labelAngle,
	};

	localStorage.setItem("settings", JSON.stringify(settings));
}

// Load settings from local storage
function loadSettings() {
	var settings = JSON.parse(localStorage.getItem("settings"));

	if (settings) {
		howManyShow = settings.howManyShow;
		howManySkip = settings.howManySkip;
		labelAngle = settings.labelAngle;

		inputHowManyShow.value = howManyShow;
		inputHowManySkip.value = howManySkip;
		inputLabelAngle.value = -labelAngle;
	}

	chart.options.plugins.datalabels.rotation = labelAngle;
}

loadSettings();
loadFromFile();