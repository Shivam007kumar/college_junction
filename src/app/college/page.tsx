"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import Link from "next/link";
import Navbar from "../components/Navbar/page";
import Footer from "../components/Footer/page";

interface College {
  _id: string;
  college_name: string;
  photo?: string;
  Rating?: string;
}

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    document.title = `College | College Junction`;
  }, []);

  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch("/api/colleges");
        const data = await response.json();
        console.log("Fetched Colleges:", data);
        setColleges(data || []);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        setColleges([]);
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
  }, []);

  const normalizeText = (text: string | null | undefined): string =>
    (text ?? "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const filteredColleges = colleges.filter((college) =>
    normalizeText(college?.college_name).includes(normalizeText(searchTerm))
  );

  return (
    <>
      <Navbar />
      <div className="search-bar-container" style={{ textAlign: "center", margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search for a college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "80%",
            maxWidth: "400px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            color: "black",
          }}
        />
      </div>
      <div className="collegearea">
        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>Loading colleges...</p>
        ) : filteredColleges.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>No colleges found.</p>
        ) : (
          filteredColleges.map((college) => {
            const ratingValue = parseFloat(college?.Rating ?? "0");
            return (
              <div key={college?._id} className="college">
                <div className="upper">
                  <div className="rateing_image">
                    {college?.photo ? (
                      <Image
                        className="college_photo"
                        src={college.photo}
                        alt={college.college_name}
                        width={150}
                        height={100}
                        unoptimized
                        priority
                        loader={({ src }) => src}
                      />
                    ) : (
                      <p>⚠️ No Image Available</p>
                    )}
                    <div className="rating">
                      <ReactStars
                        count={5}
                        size={24}
                        value={ratingValue}
                        color1="lightgray"
                        color2="gold"
                        edit={false}
                        half={true}
                      />
                      <p style={{ fontSize: "14px", marginTop: "5px" }}>
                        {ratingValue > 0 ? `${ratingValue} / 5 ⭐` : "No Rating Available"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="middle">
                  <h1>{college?.college_name}</h1>
                </div>
                <div className="lower">
                  <Link href={`/college/${college?._id}`}>
                    <button>View College</button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
}