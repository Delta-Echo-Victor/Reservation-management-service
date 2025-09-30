import { MongoClient } from "mongodb";
import { MONGO_URI, DB_NAME } from "../config.js";

let client;
export async function getDb() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}