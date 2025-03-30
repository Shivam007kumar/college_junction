
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Navbar from "./components/Navbar/page";
import Footer from "./components/Footer/page";

// Import Images
import notes from "./img/notes (1).png";
import college from "./img/user.png";
import photo from "./img/play.png";
import insta from "./img/instagram.png";
import linkdeIn from "./img/linkedin.png";

// Team Photos
import aaryan from "./img/team/aaryan.png";
import satyam from "./img/team/satyam.png";
import shivam from "./img/team/shivam (1).png";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            gsap.from(".hero-content h1", { opacity: 0, y: -50, duration: 1, ease: "power2.out" });
            gsap.from(".hero-content p", { opacity: 0, y: 50, duration: 1, delay: 0.3, ease: "power2.out" });
            gsap.from(".btn", { opacity: 0, scale: 0.5, duration: 0.5, delay: 0.6, ease: "back.out(1.7)" });

            gsap.utils.toArray(".feature div").forEach((box, i) => {
                if (box instanceof HTMLElement) {
                    gsap.from(box, {
                        opacity: 0,
                        y: 100,
                        duration: 1,
                        delay: i * 0.3,
                        scrollTrigger: {
                            trigger: box,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    });
                }
            });
        }
    }, [isMounted]);

    if (!isMounted) return null;

    return (
        <div className="container">
            <div className="heros">
                <Navbar />
                <section className="hero">
                    <div className="hero-content">
                        <h1>College Junction</h1>
                        <p>Empowering Students with AI for Smarter Learning</p>
                        <Link href="#" className="start">
                            Get Started →
                        </Link>
                    </div>
                </section>
            </div>

            <div className="feature">
                <div className="firstbox">
                    <center>
                        <Image src={notes} alt="Educational Notes Icon" />
                    </center>
                    <Link className="link" href="/components/notes">
                        <h3>Educational Notes</h3>
                    </Link>
                    <p>Access detailed notes and enhance your learning experience today!</p>
                </div>
                <div className="secondbox">
                    <center>
                        <Image src={college} alt="College Finder Icon" />
                    </center>
                    <Link className="link" href="/collegefinder">
                        <h3>College Finder</h3>
                    </Link>
                    <p>Leverage our AI to find the best colleges and courses tailored to you.</p>
                </div>
                <div className="thirdbox">
                    <center>
                        <Image src={photo} alt="AI Features Icon" />
                    </center>
                    <Link className="link" href="/collegefinder">
                        <h3>AI Features</h3>
                    </Link>
                    <p>Explore AI features for personalized learning and study assistance!</p>
                </div>
            </div>

            <center>
                <h2>Our Team</h2>
                <p>
                    We&apos;re a passionate team dedicated to enhancing student learning experiences through innovative
                    resources.
                </p>
            </center>

            <div className="ourteam">
                {[
                    { name: "Aaryan Pandey", role: "Frontend and Backend Developer", img: aaryan },
                    { name: "Satyam Singh", role: "ML & Data Searching", img: satyam },
                    { name: "Shivam Kumar", role: "AI & ML Solutions", img: shivam },
                ].map((member, index) => (
                    <div className="team" key={index}>
                        <center>
                            <Image src={member.img} alt={member.name} />
                        </center>
                        <div className="info">
                            <div className="info_left">
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                            <div className="info_right">
                                <a target="_blank" href="https://www.instagram.com/code_with_aaryan/">
                                    <Image src={insta} alt="Instagram Link" />
                                </a>
                                <a target="_blank" href="https://www.linkedin.com/in/aaryan-pandey-%F0%9F%98%8E-107a01344/">
                                    <Image src={linkdeIn} alt="LinkedIn Link" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
