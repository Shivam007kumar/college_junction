"use client"; // Add this directive for client-side interactivity

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar/page";
import Head from "next/head";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Footer from "@/app/components/Footer/page";

type College = {
  college_name: string;
  branches?: string[];
  Rating?: number;
  photo?: string;
  Map?: string;
};

type Review = {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

export default function CollegePage() {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showBranches, setShowBranches] = useState(false);

  // Fetch college data and reviews
  useEffect(() => {
    async function fetchCollegeAndReviews() {
      try {
        const response = await fetch(`/api/colleges/${id}`);
        if (!response.ok) throw new Error("Failed to fetch college data");
        const data = await response.json();
        setCollege(data.college);
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching college details or reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCollegeAndReviews();
  }, [id]);

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Submitting review:", { rating, reviewText }); // Debugging

      const response = await fetch(`/api/colleges/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "guest", // Replace with actual user ID from session
          username: "Guest User", // Replace with actual username from session
          rating,
          reviewText,
        }),
      });

      console.log("Response status:", response.status); // Debugging

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setReviewText("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading college details...</p>;
  if (!college) return <p className="loading-text">College not found.</p>;

  return (
    <>
      <Head>
        <meta name="description" content="Welcome to the home page of College Junction." />
      </Head>
      <Navbar />
      <div className="collegesss">
        {/* College details and reviews */}
        <div className="review-section">
          <div className="review-left">
            <h1>{college.college_name}</h1>
            <h2>
              Branches: {college.branches?.[0] || "N/A"} 
              {college.branches && college.branches.length > 1 && (
                <span 
                  className="branch-toggle" 
                  onClick={() => setShowBranches(!showBranches)}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                >
                  {showBranches ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </h2>
            {showBranches && (
              <ul className="branch-list">
                {college.branches?.slice(1).map((branch, index) => (
                  <li key={index}>{branch}</li>
                ))}
              </ul>
            )}
            <h3>Rating: {college.Rating || "N/A"} ⭐</h3>
          </div>
          <div className="review-right">
            {college.photo ? (
              <Image
                src={college.photo}
                alt="College Image"
                height={315}
                width={630}
                unoptimized
                onError={(e) => {
                  console.error("Error loading image:", e);
                  e.currentTarget.src = "/default-image.jpg"; // Fallback image
                }}
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
        </div>

        {/* College address and map */}
        <div className="college-address">
          <div className="college-details">
            <h3>College Details & Address</h3>
            {college.Map && college.Map.startsWith("https://www.google.com/maps/embed") ? (
              <iframe
                src={college.Map}
                width="100%"
                height="450"
                style={{ border: "0" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="College Location"
              ></iframe>
            ) : (
              <p>No Map Available or Invalid URL</p>
            )}
          </div>
          <div className="college-timings">
            <h3>Monday - Saturday: 09:00 AM to 06:00 PM</h3>
            <h3>Sunday: Closed</h3>
          </div>
        </div>

        {/* Reviews section */}
        <div className="review-summary">
          <h1>Review</h1>
          <h1>⭐ {college.Rating || "N/A"}</h1>
        </div>

        <div className="review-section">
          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review">
                <h4>{review.username} - {review.rating} ⭐</h4>
                <p>{review.reviewText}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {/* Review form */}
        <div className="review-form">
          <h3>Leave a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="rating-input">
              <label htmlFor="rating">Rating:</label>
              <input
                type="number"
                id="rating"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              />
            </div>
            <div className="review-text-input">
              <label htmlFor="reviewText">Review:</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                required
              />
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>

        <Footer />
      </div>
    </>
  );
}