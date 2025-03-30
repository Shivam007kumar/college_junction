import { MongoClient } from "mongodb";

// Replace with your actual MongoDB URI
const uri = "mongodb://localhost:27017"; 

if (!uri) {
  throw new Error("⚠️ MongoDB URI is missing!");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;
export default clientPromise;
