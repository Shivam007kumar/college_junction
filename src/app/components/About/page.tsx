"use client";
import Image from "next/image";
import aboutimage from "../img/about1.jpg"
import insta_white from "../img/insta_white.png";
import facebook from "../img/facebook.png";
import { useEffect } from "react";
import Navbar from "../Navbar/page";
import Footer from "../Footer/page";
export default function Login() {
    useEffect(() => {
        document.title = `About | College Junction`;
    });
    return (
        <div>
            <div className="about">
                <div className="aboutupper">
                    <Navbar />
                    <div className="uppercontent">
                        <center>
                            <h1>Defining your future Starts with growing your skills</h1>
                            <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, ipsum.</h4>
                            <button>Find Courses</button>
                        </center>
                    </div>
                </div>
                <div className="aboutmiddle">
                    <div className="aboutleft">
                        <Image src={aboutimage} alt="Hero page" />
                    </div>
                    <div className="aboutright">
                        <h1>Our online learning platform Top Skills You Need To Know</h1>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus, a!</p>
                        <ul>
                            <li>Best Review of Colleges</li>
                            <li>Best Notes for your study</li>
                            <li>24/7 Online Support</li>
                            <li>Personalized chat assistance</li>
                        </ul>
                    </div>
                </div>
                <div className="footerr">

                    <div className="today">
                        <h1>Join College Junction Today!</h1>
                        <p>Explore our extensive collection of student notes and college listings powered by AI.</p>
                        <div className="subscription">
                            <input type="email" placeholder="Enter your email" />
                            <button>Subscribe</button>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </div>
    );
}
