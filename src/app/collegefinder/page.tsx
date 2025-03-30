"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactStars from 'react-stars';
import Navbar from '../components/Navbar/page';
import Footer from '../components/Footer/page';
import college from '../components/img/logo-black.png';

interface College {
  _id: string;
  college: string;
  branch: string;
  cutoff: number;
  rf_predicted_cutoff: number;
  xgb_predicted_cutoff: number;
  rating?: number;
  photo?: string;
}

export default function Home() {
  const [percentile, setPercentile] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [round, setRound] = useState<string>('');
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'predictor' | 'results'>('predictor');
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Cyberpunk color scheme
  const colors = {
    primary: '#00f0ff',
    secondary: '#ff00aa',
    accent: '#ffcc00',
    dark: '#0a0a1a',
    darker: '#050510',
    light: '#e0e0ff',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          percentile: parseFloat(percentile),
          location,
          section,
          round: parseInt(round),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        setError("No colleges found matching your criteria.");
      } else {
        setResults(data);
        setActiveTab('results');
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add floating particles effect
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'cyber-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      const colorOptions = [colors.primary, colors.secondary, colors.accent];
      particle.style.backgroundColor = colorOptions[Math.floor(Math.random() * 3)] || colors.primary;
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      document.querySelector('.cyber-bg')?.appendChild(particle);

      const duration = Math.random() * 20 + 10;
      particle.style.animation = `float ${duration}s linear infinite`;

      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div className="cyber-theme">
        {/* Animated background elements */}
        <div className="cyber-bg">
          <div className="cyber-grid"></div>
          <div className="cyber-scanlines"></div>
          <div className="cyber-glow"></div>
        </div>

        <div className="cyber-container">
          {/* Futuristic tabs */}
          <div className="cyber-tabs">
            <button 
              className={`cyber-tab ${activeTab === 'predictor' ? 'active' : ''}`}
              onClick={() => setActiveTab('predictor')}
            >
              <span className="cyber-hologram">PREDICTOR</span>
            </button>
            <button 
              className={`cyber-tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
              disabled={results.length === 0}
            >
              <span className="cyber-hologram">RESULTS</span>
            </button>
          </div>

          {/* Main content area */}
          <div className="cyber-content">
            {activeTab === 'predictor' && (
              <div className="cyber-form-container" ref={formRef}>
                <div className="cyber-terminal">
                  <div className="terminal-header">
                    <div className="terminal-title">
                      <span className="blinking-cursor">_</span>
                      <span className="typing-text">COLLEGE_PREDICTOR</span>
                    </div>
                  </div>
                  <div className="terminal-body">
                    <form onSubmit={handleSubmit} className="cyber-form">
                      <div className="cyber-input-group">
                        <label className="cyber-label">
                          <span className="label-text">PERCENTILE</span>
                          <span className="label-decoration"></span>
                        </label>
                        <div className="cyber-input-wrapper">
                          <input
                            type="number"
                            value={percentile}
                            onChange={(e) => setPercentile(e.target.value)}
                            placeholder="00.00"
                            required
                            min="0"
                            max="100"
                            step="0.01"
                            className="cyber-input"
                          />
                          <span className="input-highlight"></span>
                          <span className="input-border"></span>
                        </div>
                      </div>

                      <div className="cyber-input-group">
                        <label className="cyber-label">
                          <span className="label-text">LOCATION</span>
                          <span className="label-decoration"></span>
                        </label>
                        <div className="cyber-input-wrapper">
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="CITY/STATE"
                            required
                            className="cyber-input"
                          />
                          <span className="input-highlight"></span>
                          <span className="input-border"></span>
                        </div>
                      </div>

                      <div className="cyber-input-group">
                        <label className="cyber-label">
                          <span className="label-text">CATEGORY</span>
                          <span className="label-decoration"></span>
                        </label>
                        <div className="cyber-select-wrapper">
                          <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            required
                            className="cyber-select"
                          >
                            <option value="" disabled>SELECT_CATEGORY</option>
                            <option value="open">OPEN</option>
                            <option value="obc">OBC</option>
                            <option value="sc">SC</option>
                            <option value="st">ST</option>
                          </select>
                          <span className="select-arrow">▼</span>
                          <span className="select-highlight"></span>
                        </div>
                      </div>

                      <div className="cyber-input-group">
                        <label className="cyber-label">
                          <span className="label-text">ROUND</span>
                          <span className="label-decoration"></span>
                        </label>
                        <div className="cyber-input-wrapper">
                          <input
                            type="number"
                            value={round}
                            onChange={(e) => setRound(e.target.value)}
                            placeholder="0"
                            required
                            min="1"
                            max="10"
                            className="cyber-input"
                          />
                          <span className="input-highlight"></span>
                          <span className="input-border"></span>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="cyber-button"
                        disabled={loading}
                      >
                        <span className="button-text">
                          {loading ? 'INITIALIZING...' : 'PREDICT'}
                        </span>
                        <span className="button-lights">
                          <span className="light red"></span>
                          <span className="light yellow"></span>
                          <span className="light green"></span>
                        </span>
                        <span className="button-overlay"></span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="cyber-results-container" ref={resultsRef}>
                <div className="cyber-results-header">
                  <h2 className="cyber-results-title">
                    <span className="title-text">RECOMMENDED INSTITUTES</span>
                    <span className="title-underline"></span>
                  </h2>
                  <div className="cyber-results-count">
                    <span className="count-number">{results.length}</span>
                    <span className="count-label">MATCHES FOUND</span>
                  </div>
                </div>

                {error && (
                  <div className="cyber-error">
                    <div className="error-icon">⚠️</div>
                    <div className="error-message">{error}</div>
                  </div>
                )}

                <div className="cyber-college-grid">
                  {results.map((college, index) => (
                    <div 
                      key={college._id} 
                      className="cyber-college-card"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        borderColor: index % 3 === 0 ? colors.primary : 
                                      index % 3 === 1 ? colors.secondary : colors.accent
                      }}
                    >
                      <div className="card-corner top-left"></div>
                      <div className="card-corner top-right"></div>
                      <div className="card-corner bottom-left"></div>
                      <div className="card-corner bottom-right"></div>
                      
                      <div className="college-image-container">
                        {college.photo ? (
                          <>
                            <Image
                              src={college.photo}
                              alt={college.college}
                              width={300}
                              height={180}
                              unoptimized
                              priority
                              loader={({ src }) => src}
                              className="college-image"
                            />
                            <div className="image-overlay"></div>
                          </>
                        ) : (
                          <div className="no-image">
                            <div className="no-image-icon">📡</div>
                            <div className="no-image-text">SIGNAL LOST</div>
                          </div>
                        )}

                        <div className="college-rating">
                          <ReactStars
                            count={5}
                            size={18}
                            value={college.rating || 0}
                            color1="rgba(255,255,255,0.3)"
                            color2={colors.accent}
                            edit={false}
                            half={true}
                          />
                          <div className="rating-value">
                            {college.rating ? `${college.rating}` : "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="college-info">
                        <h3 className="college-name">{college.college}</h3>
                        <div className="college-branch">{college.branch}</div>
                      </div>

                      <div className="college-stats">
                        <div className="stat-item">
                          <div className="stat-label">CUTOFF</div>
                          <div className="stat-value">{college.cutoff}</div>
                        </div>

                        <div className="stat-item">
                          <div className="stat-label">RF PREDICTED</div>
                          <div className="stat-value">{college.rf_predicted_cutoff}</div>
                        </div>

                        <div className="stat-item">
                          <div className="stat-label">XGB PREDICTED</div>
                          <div className="stat-value">{college.xgb_predicted_cutoff}</div>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="cyber-view-button">
                          <span className="button-text">ACCESS DATABASE</span>
                          <span className="button-icon">→</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
        /* Cyberpunk Theme Styles */
        :root {
          --primary: ${colors.primary};
          --secondary: ${colors.secondary};
          --accent: ${colors.accent};
          --dark: ${colors.dark};
          --darker: ${colors.darker};
          --light: ${colors.light};
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          // background-color: var(--darker);
          // color: var(--light);
          // font-family: 'Rajdhani', 'Orbitron', sans-serif;
          // overflow-x: hidden;
          // line-height: 1.6;
        }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-100px) translateX(20px); }
          100% { transform: translateY(0) translateX(0); }
        }

        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 0.99;
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
          }
        }

        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
          100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .cyber-theme {
          position: relative;
          min-height: 100vh;
          // background-color: var(--darker);
            background: linear-gradient(to right, #141e30, #243b55);

        }

        .cyber-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .cyber-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(var(--primary-rgb), 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--primary-rgb), 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.3;
        }

        .cyber-scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(
              to bottom,
              transparent 95%,
              rgba(var(--primary-rgb), 0.03) 96%,
              transparent 97%
            );
          background-size: 100% 5px;
          animation: scanline 1s linear infinite;
          pointer-events: none;
        }

        .cyber-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .cyber-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
        }

        .cyber-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        /* Cyber Tabs */
        .cyber-tabs {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(var(--primary-rgb), 0.3);
          position: relative;
        }

        .cyber-tabs::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          height: 2px;
          width: 50%;
          background: var(--primary);
          transition: all 0.3s ease;
          transform: translateX(${activeTab === 'predictor' ? '0' : '100%'});
        }

        .cyber-tab {
          flex: 1;
          background: none;
          border: none;
          padding: 1rem;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          color: rgba(var(--light-rgb), 0.7);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .cyber-tab.active {
          color: var(--primary);
        }

        .cyber-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cyber-hologram {
          position: relative;
          display: inline-block;
        }

        .cyber-hologram::before {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .cyber-tab.active .cyber-hologram::before {
          transform: scaleX(1);
        }

        /* Cyber Terminal */
        .cyber-terminal {
          background: rgba(var(--dark-rgb), 0.8);
          border: 1px solid rgba(var(--primary-rgb), 0.3);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.1),
                      0 0 40px rgba(var(--primary-rgb), 0.05);
          position: relative;
        }

        .terminal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          background: rgba(var(--dark-rgb), 0.9);
          border-bottom: 1px solid rgba(var(--primary-rgb), 0.2);
        }

        .terminal-title {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: var(--primary);
          display: flex;
          align-items: center;
        }

        .blinking-cursor {
          animation: blink 1s infinite;
          margin-right: 5px;
        }

        .typing-text {
          position: relative;
        }

        .typing-text::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, transparent, var(--dark), transparent);
          animation: typing 3s steps(20) infinite;
        }

        @keyframes typing {
          from { left: 0; }
          to { left: 100%; }
        }

        .terminal-controls {
          display: flex;
          gap: 8px;
        }

        .control-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ccc;
        }

        .terminal-body {
          padding: 2rem;
        }

        /* Cyber Form */
        .cyber-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cyber-input-group {
          position: relative;
        }

        .cyber-label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: var(--primary);
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .label-text {
          position: relative;
          z-index: 1;
          background: var(--dark);
          padding-right: 10px;
        }

        .label-decoration {
          flex-grow: 1;
          height: 1px;
          background: linear-gradient(to right, var(--primary), transparent);
          margin-left: 10px;
        }

        .cyber-input-wrapper {
          position: relative;
        }

        .cyber-input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(var(--dark-rgb), 0.7);
          border: 1px solid rgba(var(--primary-rgb), 0.3);
          color: var(--light);
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .cyber-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
        }

        .input-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .cyber-input:focus ~ .input-highlight {
          transform: scaleX(1);
        }

        .input-border {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid transparent;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .cyber-input:focus ~ .input-border {
          border: 1px solid var(--primary);
          box-shadow: inset 0 0 10px rgba(var(--primary-rgb), 0.2);
        }

        /* Cyber Select */
        .cyber-select-wrapper {
          position: relative;
        }

        .cyber-select {
          width: 100%;
          padding: 12px 15px;
          background: rgba(var(--dark-rgb), 0.7);
          border: 1px solid rgba(var(--primary-rgb), 0.3);
          color: var(--light);
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          appearance: none;
          transition: all 0.3s ease;
        }

        .cyber-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
        }

        .select-arrow {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          color: var(--primary);
          pointer-events: none;
        }

        .select-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .cyber-select:focus ~ .select-highlight {
          transform: scaleX(1);
        }

        /* Cyber Button */
        .cyber-button {
          position: relative;
          padding: 15px 30px;
          background: var(--dark);
          border: 1px solid var(--primary);
          color: var(--primary);
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cyber-button:hover {
          background: rgba(var(--primary-rgb), 0.1);
          box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4);
          transform: translateY(-2px);
        }

        .cyber-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        .button-lights {
          display: flex;
          gap: 5px;
        }

        .light {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .light.red {
          background: #ff5f56;
          animation: flicker 3s infinite;
        }

        .light.yellow {
          background: #ffbd2e;
          animation: flicker 3s infinite 0.5s;
        }

        .light.green {
          background: #27c93f;
          animation: flicker 3s infinite 1s;
        }

        .button-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .cyber-button:hover .button-overlay {
          transform: translateX(100%);
        }

        /* Results Container */
        .cyber-results-container {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cyber-results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(var(--primary-rgb), 0.3);
        }

        .cyber-results-title {
          font-family: 'Orbitron', sans-serif;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 3px;
          position: relative;
          padding-bottom: 10px;
        }

        .title-text {
          position: relative;
          display: inline-block;
        }

        .title-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), transparent);
          transform-origin: left;
          animation: underlineExpand 1s ease-out forwards;
        }

        @keyframes underlineExpand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .cyber-results-count {
          text-align: right;
        }

        .count-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary);
          font-family: 'Orbitron', sans-serif;
        }

        .count-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(var(--light-rgb), 0.7);
        }

        /* Cyber Error */
        .cyber-error {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 87, 87, 0.1);
          border-left: 3px solid #ff5757;
          margin-bottom: 2rem;
        }

        .error-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          color: #ff5757;
        }

        .error-message {
          color: #ff8080;
        }

        /* Cyber College Grid */
        .cyber-college-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        /* Cyber College Card */
        .cyber-college-card {
          position: relative;
          background: rgba(var(--dark-rgb), 0.7);
          border: 1px solid;
          border-radius: 5px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: cardAppear 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
          padding: 1.5rem;
        }

        @keyframes cardAppear {
          to { opacity: 1; transform: translateY(0); }
        }

        .card-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-width: 2px;
          border-style: solid;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-corner.top-left {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
          border-color: inherit;
        }

        .card-corner.top-right {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
          border-color: inherit;
        }

        .card-corner.bottom-left {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
          border-color: inherit;
        }

        .card-corner.bottom-right {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
          border-color: inherit;
        }

        .cyber-college-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .cyber-college-card:hover .card-corner {
          opacity: 1;
        }

        .college-image-container {
          position: relative;
          height: 180px;
          overflow: hidden;
          margin: -1.5rem -1.5rem 1rem -1.5rem;
        }

        .college-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .cyber-college-card:hover .college-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%);
        }

        .no-image {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        }

        .no-image-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }

        .no-image-text {
          font-family: 'Orbitron', sans-serif;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }

        .college-rating {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 20px;
          padding: 5px 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          backdrop-filter: blur(5px);
          z-index: 1;
        }

        .rating-value {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .college-info {
          margin-bottom: 1.5rem;
        }

        .college-name {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--light);
          font-family: 'Orbitron', sans-serif;
        }

        .college-branch {
          display: inline-block;
          font-size: 0.8rem;
          color: var(--primary);
          background: rgba(var(--primary-rgb), 0.1);
          padding: 3px 8px;
          border-radius: 3px;
          border-left: 2px solid var(--primary);
        }

        .college-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(var(--light-rgb), 0.7);
          margin-bottom: 0.3rem;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: bold;
          color: var(--light);
          font-family: 'Orbitron', sans-serif;
        }

        /* Cyber View Button */
        .cyber-view-button {
          position: relative;
          width: 100%;
          padding: 10px;
          background: rgba(var(--dark-rgb), 0.8);
          border: 1px solid var(--primary);
          color: var(--primary);
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cyber-view-button:hover {
          background: rgba(var(--primary-rgb), 0.1);
        }

        .button-icon {
          font-weight: bold;
          transition: transform 0.3s ease;
        }

        .cyber-view-button:hover .button-icon {
          transform: translateX(3px);
        }

        /* Responsive Adjustments */
        @media (max-width: 992px) {
          .cyber-college-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .cyber-results-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .cyber-results-count {
            margin-top: 1rem;
            text-align: left;
          }
        }

        @media (max-width: 576px) {
          .cyber-container {
            padding: 1rem;
          }

          .terminal-body {
            padding: 1.5rem 1rem;
          }

          .cyber-college-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      </div>
      <Footer/>
    </>
  );
}

    

   