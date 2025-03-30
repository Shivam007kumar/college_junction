"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import insta_white from "../img/insta_white.png";
import facebook from "../img/facebook.png";
export default function Footer() {

  return (
    <div>
      {/* Langflow Chatbot */}
    
     <div className="footerr">
        <footer>
          <div className="footer-content">
            <h2>College Junction</h2>
            <p>Join College Junction to access comprehensive study notes and a complete list of colleges tailored for your academic journey.</p>
            <nav>
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Courses</a>
              <a href="#">Instructors</a>
            </nav>
            <div className="social-icons">
              <a href="#"><Image src={insta_white} alt="Instagram" /></a>
              <a href="#"><Image src={facebook} alt="Facebook" /></a>
            </div>
            <p>&copy; 2025 collegejunction.com. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
