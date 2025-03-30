import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("collegejunction");

    console.log("Fetching college with ID:", params.id); // Debugging

    // Convert the ID to ObjectId
    const objectId = new ObjectId(params.id);

    console.log("Converted ObjectId:", objectId); // Debugging

    // Fetch college data
    const college = await db.collection("colleges").findOne({
      _id: objectId,
    });

    if (!college) {
      console.log("College not found for ID:", params.id); // Debugging
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    console.log("Fetched College Data:", college); // Debugging

    // Fetch reviews for the college
    const reviews = await db.collection("reviews").find({ collegeId: params.id }).toArray();

    console.log("Fetched Reviews:", reviews); // Debugging

    return NextResponse.json({ college, reviews });
  } catch (error) {
    console.error("Error fetching college or reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("collegejunction");

    const { userId = "guest", username = "User", rating, reviewText } = await req.json();

    console.log("Received review data:", { userId, username, rating, reviewText }); // Debugging

    if (!rating || !reviewText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = {
      collegeId: params.id,
      userId,
      username,
      rating,
      reviewText,
      createdAt: new Date(),
    };

    // Insert the review into the database
    const result = await db.collection("reviews").insertOne(review);

    console.log("Inserted Review:", result); // Debugging

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}