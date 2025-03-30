"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/page";
import Footer from "../Footer/page";

interface Note {
    name: string;
    path: string;
    year: string;
    branch: string;
    semester: string;
}

export default function NotesPage() {
    const [years, setYears] = useState<string[]>([]);
    const [branches, setBranches] = useState<string[]>([]);
    const [semesters, setSemesters] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    
    const [year, setYear] = useState<string>("");
    const [branch, setBranch] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/notes")
            .then(res => res.json())
            .then(data => {
                setYears(data.years || []);
            })
            .catch(err => console.error("Error fetching years:", err));
    }, []);

    useEffect(() => {
        if (!year) {
            setBranches([]);
            setSemesters([]);
            setNotes([]);
            return;
        }

        fetch(`/api/notes?year=${year}`)
            .then(res => res.json())
            .then(data => {
                setBranches(data.branches || []);
            })
            .catch(err => console.error("Error fetching branches:", err));
    }, [year]);

    useEffect(() => {
        if (!year || !branch) {
            setSemesters([]);
            setNotes([]);
            return;
        }

        fetch(`/api/notes?year=${year}&branch=${branch}`)
            .then(res => res.json())
            .then(data => {
                setSemesters(data.semesters || []);
            })
            .catch(err => console.error("Error fetching semesters:", err));
    }, [year, branch]);

    useEffect(() => {
        if (!year || !branch || !semester) {
            setNotes([]);
            return;
        }

        fetch(`/api/notes?year=${year}&branch=${branch}&semester=${semester}`)
            .then(res => res.json())
            .then(data => {
                setNotes(data.notes || []);
            })
            .catch(err => console.error("Error fetching notes:", err));
    }, [year, branch, semester]);

    return (
        <>
            <Navbar />
            <div className="container">
                {selectedPdf ? (
                    <motion.div className="viewer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <button className="back-btn" onClick={() => setSelectedPdf(null)}>⬅ Back</button>
                        <h2>Viewing: {decodeURIComponent(selectedPdf.split('/').pop() || "")}</h2>
                        <iframe src={`/components/secure-pdf-viewer?file=${encodeURIComponent(selectedPdf)}`} width="100%" height="600px" style={{ border: "none" }}></iframe>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <h1 className="title">📚 Select Your Notes</h1>

                        <div className="card">
                            <div className="filters">
                                <label>Year: </label>
                                <select value={year} onChange={e => setYear(e.target.value)}>
                                    <option value="">Select Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="filters">
                                <label>Branch: </label>
                                <select value={branch} onChange={e => setBranch(e.target.value)} disabled={!year}>
                                    <option value="">Select Branch</option>
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="filters">
                                <label>Semester: </label>
                                <select value={semester} onChange={e => setSemester(e.target.value)} disabled={!branch}>
                                    <option value="">Select Semester</option>
                                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <h2>📄 Available PDFs</h2>
                        {notes.length === 0 ? (
                            <p className="no-notes">No notes available</p>
                        ) : (
                            <ul className="notes-list">
                                {notes.map(pdf => (
                                    <motion.li key={pdf.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <button onClick={() => setSelectedPdf(pdf.path)}>
                                            {decodeURIComponent(pdf.name)}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </div>
            <style jsx>{`
                .container {
                    background: linear-gradient(to right, #141e30, #243b55);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    min-height: 100vh;
                    text-align: center;
                    user-select: none;
                    padding: 20px;
                    color: white;
                }
                .title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .back-btn {
                    background: #ff4757;
                    color: white;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 10px;
                    font-size: 18px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: background 0.3s ease;
                }
                .back-btn:hover {
                    background: #e84118;
                }
                .viewer {
                    width: 100%;
                    text-align: center;
                }
                .card {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
                    width: 100%;
                    max-width: 500px;
                    margin: 20px auto;
                }
                .filters {
                    margin-bottom: 10px;
                }
                select {
                    padding: 10px;
                    border-radius: 5px;
                    border: none;
                    outline: none;
                    background: #ffffff;
                    color: #333;
                    font-size: 16px;
                    width: 100%;
                }
                .notes-list {
                    list-style: none;
                    padding: 0;
                }
                .notes-list li {
                    margin-top: 10px;
                }
                .notes-list button {
                    background: #1abc9c;
                    color: white;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    margin: 12px;
                }
                .notes-list button:hover {
                    background: #16a085;
                }
                .no-notes {
                    font-size: 1.2rem;
                    color: #f1c40f;
                }
            `}</style>
            <Footer />
        </>
    );
}
