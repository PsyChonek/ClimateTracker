import { MongoClient } from "mongodb";

export default async function connect(port, host, user, password, database) {
	const url = `mongodb://${user}:${password}@${host}:${port}`;
	const client = new MongoClient(url);
	await client.connect();
	const db = client.db(database);
	return db;
}
