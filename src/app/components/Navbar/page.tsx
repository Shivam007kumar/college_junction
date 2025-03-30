"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import WhiteLogo from "../img/logo-white.png";
import BlackLogo from "../img/logo-black.png";

// Langflow Chat Component
const LangflowChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <langflow-chat
      window_title="College JN"
      flow_id="f19dedce-eedf-45c2-b056-bb74a36a76dc"
      host_url="http://127.0.0.1:7860"
    />
  );
};

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) return null;

  const isHomePage = pathname === "/";
  const textClass = isHomePage ? "text-home-page" : "text-other-pages";
  const buttonClass = isHomePage ? "btn-home-page" : "btn-other-pages";
  const logoSrc = isHomePage ? WhiteLogo : BlackLogo;
  const navbarClass = isHomePage ? "fixed-navbar" : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="container">
      <div className="heros">
        <div className={`navbar ${navbarClass} ${scrolled ? "scrolled" : ""}`}>
          <nav className="nav">
            <div className="logo">
              <Image className="navlogo" src={logoSrc} alt="Logo" height={75} />
            </div>

            <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <ul className={`nav-links ${isMenuOpen ? "mobile-menu" : ""}`}>
              <Link className="link" href="/" onClick={closeMenu}>
                <li className={textClass}>Home</li>
              </Link>
              <Link className="link" href="/components/About" onClick={closeMenu}>
                <li className={textClass}>About</li>
              </Link>
              <Link className="link" href="/components/notes" onClick={closeMenu}>
                <li className={textClass}>Notes</li>
              </Link>
              <Link className="link" href="/college" onClick={closeMenu}>
                <li className={textClass}>Colleges</li>
              </Link>
              {!isLoggedIn ? (
                <button className={`${buttonClass}`} onClick={closeMenu}>
                  <Link href="/components/Login">Get Started</Link>
                </button>
              ) : (
                <button className={`${buttonClass}`} onClick={() => { handleLogout(); closeMenu(); }}>
                  Logout
                </button>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* CSS Fix: Chatbot opens at the top-left */}
      <style jsx global>{`
        langflow-chat {
          position: fixed !important;
          top: 80px !important;   /* Adjust based on navbar height */
          left: 20px !important;  /* Move to the left */
          bottom: auto !important;
          right: auto !important;
          z-index: 9999 !important;
          width: 300px; /* Set width */
          height: auto; /* Auto adjust */
        }
      `}</style>

      {isMounted && <LangflowChat />}
    </div>
  );
}