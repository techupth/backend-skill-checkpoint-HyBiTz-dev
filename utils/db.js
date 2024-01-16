import { MongoClient } from "mongodb";

const connectionString = "mongodb://172.29.112.1:27017";

export const client = new MongoClient(connectionString);

export const db = client.db("practice-mongo-skillcheckpoint");
