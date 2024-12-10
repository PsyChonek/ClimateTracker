// ESM
import Fastify from "fastify";
import connect from "./db.js";
import cors from "@fastify/cors";

const fastify = Fastify({
	logger: true,
});

await fastify.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
});

const PORT = process.env.PORT || 27017;
const HOST = process.env.HOST || "db";
const USER = process.env.USER || "admin";
const PASSWORD = process.env.PASSWORD || "secret";
const DATABASE = process.env.DATABASE || "climate";

console.log(`Connecting to ${HOST}:${PORT}`);

const db = await connect(PORT, HOST, USER, PASSWORD, DATABASE);
const readings = db.collection("readings");

// POST newReading
fastify.post("/newReading", async (request, reply) => {
	const { sensorID, temperature, humidity, timestamp } = request.body;		

	let timestampNew = timestamp ? new Date(parseInt(timestamp)*1000).toISOString() : new Date().toISOString();

	var log = {
		sensorID: sensorID,
		temperature: temperature,
		humidity: humidity,
		timestamp: timestamp,
		timestampNew: timestampNew
	};
	console.log(log);

	const newReading = { sensorID, temperature, humidity, timestamp : timestampNew };
	const result = await readings.insertOne(newReading);
	return result;
});

// GET allReadings params: fromDate, toDate
fastify.get("/allReadings", async (request, reply) => {
	const { fromDate, toDate } = request.query;
	console.log(fromDate, toDate);

	/* example of data in db
	{
	sensorID: undefined,
	temperature: 23.79999924,
	humidity: 65,
	timestamp: 1733853864,
	timestampNew: '2024-12-10T18:04:24.000Z'
	}
	*/

	// Filter by date
	const result = await readings.find({
		timestampNew: {
			$gte: fromDate ? new Date(fromDate) : new Date(0),
			$lte: toDate ? new Date(toDate) : new Date(),
		},
	}).toArray();


	return result;
});

/**
 * Run the server!
 */
const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();