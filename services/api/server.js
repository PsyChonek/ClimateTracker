// ESM
import Fastify from "fastify";
import connect from "./db.js";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { ObjectId } from "mongodb";

const fastify = Fastify({
	logger: true,
});

await fastify.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

await fastify.register(fastifySwagger, {
	routePrefix: "/documentation",
	exposeRoute: true,
	swagger: {
		info: {
			title: "Climate API",
			description: "API for the Climate project.",
			version: "0.1.0",
		},
	},
});

await fastify.register(fastifySwaggerUI, {
	routePrefix: "/documentation",
	uiConfig: {
		docExpansion: "full",
		deepLinking: false,
	},
	uiHooks: {
		onRequest: function (request, reply, next) {
			next();
		},
		preHandler: function (request, reply, next) {
			next();
		},
	},
	staticCSP: true,
	transformStaticCSP: (header) => header,
	transformSpecification: (swaggerObject, request, reply) => {
		return swaggerObject;
	},
	transformSpecificationClone: true,
});

const PORT = process.env.PORT || 27017;
const HOST = process.env.HOST || "db";
const USER = process.env.USER || "admin";
const PASSWORD = process.env.PASSWORD || "secret";
const DATABASE = process.env.DATABASE || "climate";

console.log(`Connecting to ${HOST}:${PORT}`);

const db = await connect(PORT, HOST, USER, PASSWORD, DATABASE);
const readings = db.collection("readings");
const sensors = db.collection("sensors");

// POST newReading
fastify.post(
	"/newReading",
	{
		schema: {
			tags: ["Readings"],
			summary: "Add a new reading",
			description: "Endpoint to add a new sensor reading to the database.",
			body: {
				type: "object",
				properties: {
					espID: { type: "string", description: "Unique ID of the sensor." },
					temperature: { type: "number", description: "Temperature reading in Celsius." },
					humidity: { type: "number", description: "Humidity reading in percentage." },
					timestamp: { type: "string", format: "date-time", description: "Timestamp of the reading." },
				},
				required: ["espID", "temperature", "humidity"],
			},
			response: {
				200: {
					description: "Reading successfully added.",
					type: "object",
					properties: {
						insertedID: { type: "string" },
					},
				},
			},
		},
	},
	async (request, reply) => {
		const { espID, temperature, humidity, timestamp } = request.body;

		let timestampNew = timestamp ? (timestamp.length === 10 ? new Date(parseInt(timestamp) * 1000).toISOString() : timestamp) : new Date().toISOString();

		var log = {
			espID: espID,
			temperature: temperature,
			humidity: humidity,
			timestamp: timestampNew,
		};
		console.log(log);

		const newReading = { espID, temperature, humidity, timestamp: new Date(timestampNew) };
		const result = await readings.insertOne(newReading);
		return result;
	}
);

// GET allReadings, readings request api to get all readings from the database
fastify.get(
	"/allReadings",
	{
		schema: {
			tags: ["Readings"],
			summary: "Get all readings",
			description: "Retrieve all readings within a specific date range.",
			querystring: {
				type: "object",
				properties: {
					fromDate: { type: "string", format: "date", description: "Start date for the range." },
					toDate: { type: "string", format: "date", description: "End date for the range." },
				},
			},
			response: {
				200: {
					description: "List of readings.",
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							espID: { type: "string" },
							temperature: { type: "number" },
							humidity: { type: "number" },
							timestamp: { type: "string", format: "date-time" },
						},
					},
				},
			},
		},
	},
	async (request, reply) => {
		const { fromDate, toDate } = request.query;

		const isValidDate = (date) => !isNaN(new Date(date).getTime());
		const startDate = fromDate && isValidDate(fromDate) ? new Date(fromDate) : new Date(0);
		const endDate = toDate && isValidDate(toDate) ? new Date(new Date(toDate).setHours(23, 59, 59, 999)) : new Date();

		try {
			// Perform the query
			const result = await readings
				.find({
					timestamp: {
						$gte: startDate,
						$lte: endDate,
					},
				})
				.toArray();

			// Change the _id to id
			result.forEach((reading) => {
				reading.id = reading._id;
				delete reading._id;
			});

			return result;
		} catch (error) {
			console.error("Error querying MongoDB:", error);
			reply.code(500).send({ error: "Failed to fetch readings." });
		}
	}
);

// POST Add sensor, sensors request api to add it to the database and return the espID api will store IP address and port of the sensor to allow communication with it
fastify.post(
	"/addSensor",
	{
		schema: {
			tags: ["Sensors"],
			summary: "Add a new sensor",
			description: "Add a new sensor to the database with its IP and port.",
			body: {
				type: "object",
				properties: {
					ip: { type: "string", format: "ipv4", description: "IP address of the sensor." },
					espID: { type: "string", description: "Unique ID of the sensor." },
				},
				required: ["ip"],
			},
			response: {
				200: {
					description: "Sensor successfully added.",
					type: "object",
					properties: {
						insertedID: { type: "string" },
					},
				},
			},
		},
	},
	async (request, reply) => {
		const { ip, espID } = request.body;
		const newSensor = { ip, espID };

		// Check if same sensor already exists
		const existingSensor = await sensors.findOne({ ip });
		if (existingSensor) {
			reply.code(400).send({ error: "Sensor already exists." });
		}

		const result = await sensors.insertOne(newSensor);
		return result;
	}
);

// GET allSensors, sensors request api to get all sensors from the database
fastify.get(
	"/allSensors",
	{
		schema: {
			tags: ["Sensors"],
			summary: "Get all sensors",
			description: "Retrieve all sensors stored in the database.",
			response: {
				200: {
					description: "List of sensors.",
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							ip: { type: "string" },
							espID: { type: "string" },
							displayName: { type: "string" },
							temperatureOffset: { type: "number" },
							humidityOffset: { type: "number" },
						},
					},
				},
			},
		},
	},
	async (request, reply) => {
		console.log("Getting all sensors");

		const result = await sensors.find().toArray();

		// Change the _id to id
		result.forEach((sensor) => {
			sensor.id = sensor._id;
			delete sensor._id;
		});

		console.log(result);
		return result;
	}
);

// PATCH sensor display neme, temperature and humidity offset
fastify.patch(
	"/sensor",
	{
		schema: {
			tags: ["Sensors"],
			summary: "Update sensor information",
			description: "Update the display name and offsets for a sensor.",
			body: {
				type: "object",
				properties: {
					id: { type: "string", description: "Unique ID" },
					espID: { type: "string", description: "Unique ID of the sensor." },
					displayName: { type: "string", description: "Display name of the sensor." },
					temperatureOffset: { type: "number", description: "Temperature offset value." },
					humidityOffset: { type: "number", description: "Humidity offset value." },
				},
				required: ["id"],
			},
			response: {
				200: {
					description: "Sensor successfully updated.",
					type: "object",
					properties: {
						modifiedCount: { type: "number" },
					},
				},
			},
		},
	},
	async (request, reply) => {
		const { id, espID, displayName, temperatureOffset, humidityOffset } = request.body;

		console.log("Updating sensor:", id);

		try {
			const result = await sensors.updateOne(
				{ _id: new ObjectId(id) }, // Convert string `id` to ObjectId
				{
					$set: {
						displayName,
						temperatureOffset,
						humidityOffset,
						espID,
					},
				}
			);

			if (result.modifiedCount === 0) {
				reply.code(404).send({ error: "Sensor not found or no changes made" });
			} else {
				reply.send({ message: "Sensor updated successfully" });
			}
		} catch (error) {
			console.error("Error updating sensor:", error);
			reply.code(500).send({ error: "Internal server error" });
		}
	}
);

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
