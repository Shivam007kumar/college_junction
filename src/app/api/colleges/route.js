import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // Change this if using a remote MongoDB
const dbName = "collegejunction"; // Your database name

export async function GET() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const colleges = await db.collection("colleges").find({}).toArray();

    client.close();
    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch data", error: error.message }, { status: 500 });
  }
}
