// src/pages/Tournament.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import tournamentQuestions from "../data/tournamentQuestions";
import AnimatedBackground from "../components/AnimatedBackground";
import Modal from "../components/Modal";


export default function Tournament() {
    const TOTAL_QUESTIONS = 15;
    const QUESTION_TIME = 15;
    const AUTO_ADVANCE_DELAY = 1000;

    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;

    const [quizQuestions, setQuizQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [scoreCount, setScoreCount] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isAlert: true });

    const autoAdvanceRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    // Security Check: Verify if user already played AND if tournament is active
    useEffect(() => {
        const checkParticipation = async () => {
            if (!user) return;
            try {
                // 1. Check Status
                const statusRes = await fetch("https://concero-lanca-backend.onrender.com/api/tournament-status");
                const statusData = await statusRes.json();

                if (statusData.status !== "active") {
                    setModalConfig({
                        isOpen: true,
                        title: "Tournament Not Active",
                        message: "The tournament is not currently active.",
                        isAlert: true,
                        onConfirm: () => navigate("/tournament-start", { state: { user } })
                    });
                    return;
                }

                // 2. Check Participation
                const res = await fetch("https://concero-lanca-backend.onrender.com/api/tournament-check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: user.username }),
                });
                const data = await res.json();
                if (data.hasPlayed) {
                    setModalConfig({
                        isOpen: true,
                        title: "Already Participated",
                        message: "You have already participated in this tournament.",
                        isAlert: true,
                        onConfirm: () => navigate("/result", { state: { user, result: { isTournament: true, IQ: 0, correct: 0, totalQuestions: TOTAL_QUESTIONS } } })
                    });
                }
            } catch (error) {
                console.error("Error checking participation:", error);
            }
        };
        checkParticipation();
    }, [user, navigate]);

    // Tournament time validation
    const tournamentStart = useMemo(() => {
        const startTime = import.meta.env.VITE_TOURNAMENT_START_UTC;
        return startTime ? new Date(startTime) : null;
    }, []);

    const tournamentEnd = useMemo(() => {
        const endTimeStr = import.meta.env.VITE_TOURNAMENT_END_UTC;
        if (endTimeStr) return new Date(endTimeStr);

        if (!tournamentStart) return null;
        const endDate = new Date(tournamentStart);
        endDate.setDate(endDate.getDate() + 7); // 7 days tournament
        return endDate;
    }, [tournamentStart]);

    const isTournamentActive = useMemo(() => {
        if (!tournamentStart || !tournamentEnd) return true; // Allow if no dates set
        const now = Date.now();
        return now >= tournamentStart.getTime() && now <= tournamentEnd.getTime();
    }, [tournamentStart, tournamentEnd]);

    // Check if user already attempted tournament
    const hasAttempted = useMemo(() => {

        setQuizQuestions(picked);
        setIndex(0);
        setSelected(null);
        setScoreCount(0);
        setTotalPoints(0);
        setTimeLeft(QUESTION_TIME);
    }, [user, navigate, isTournamentActive, hasAttempted]);

    // Timer logic
    useEffect(() => {
        if (!quizQuestions.length) return;
        clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft((t) => (t > 0 && selected === null ? t - 1 : t));
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [quizQuestions, index, selected]);

    useEffect(() => {
        if (!quizQuestions.length) return;
        if (timeLeft <= 0 && selected === null) handleTimeout();
    }, [timeLeft, quizQuestions, selected]);

    useEffect(() => {
        return () => {
            clearTimeout(autoAdvanceRef.current);
            clearInterval(timerRef.current);
        };
    }, []);

    const currentQ = quizQuestions[index];

    const handleAnswer = (option) => {
        if (selected !== null) return;
        setSelected(option);

        const isCorrect = option === currentQ.answer;
        if (isCorrect) {
            setScoreCount((s) => s + 1);
            setTotalPoints((p) => p + 1 + timeLeft / QUESTION_TIME);
        }

        if (index + 1 < quizQuestions.length) {
            clearTimeout(autoAdvanceRef.current);
            autoAdvanceRef.current = setTimeout(() => goNext(), AUTO_ADVANCE_DELAY);
        }
    };

    const handleTimeout = () => {
        if (selected !== null) return;
        setSelected("__TIMED_OUT__");

        if (index + 1 < quizQuestions.length) {
            clearTimeout(autoAdvanceRef.current);
            autoAdvanceRef.current = setTimeout(() => goNext(), AUTO_ADVANCE_DELAY);
        }
    };

    const goNext = () => {
        clearTimeout(autoAdvanceRef.current);
        if (index + 1 < quizQuestions.length) {
            setIndex((i) => i + 1);
            setSelected(null);
            setTimeLeft(QUESTION_TIME);
        }
    };

    const finishQuiz = async () => {
        const maxPoints = TOTAL_QUESTIONS * 2;
        const percent = totalPoints / maxPoints;
        const IQ = Math.round(55 + percent * 90);
        const timeSpent = Date.now() - startTimeRef.current;

        const result = {
            correct: scoreCount,
            totalPoints,
            IQ,
            totalQuestions: TOTAL_QUESTIONS,
            isTournament: true,
        };

        try {
            const response = await fetch("https://concero-lanca-backend.onrender.com/api/submitTournamentResult", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    score: result.IQ, // Using IQ as the score for leaderboard
                    correct: result.correct,
                    totalQuestions: result.totalQuestions,
                    timeSpent: timeSpent,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error("❌ Failed to save tournament result:", errData.message);
                if (response.status === 403) {
                    setModalConfig({
                        isOpen: true,
                        title: "Submission Failed",
                        message: "You have already participated in this tournament.",
                        isAlert: true,
                        onConfirm: () => navigate("/result", { state: { result, user } })
                    });
                    return; // Stop execution to show modal
                }
            } else {
                console.log("✅ Tournament result saved successfully!");
            }
        } catch (error) {
            console.error("❌ Error submitting result:", error);
        }

        navigate("/result", { state: { result, user } });
    };


    if (!quizQuestions.length) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#ffd7b5] dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
                <AnimatedBackground />
                <div className="text-2xl font-bold animate-pulse relative z-20">Loading tournament...</div>
            </div>
        );
    }

    const progressPct = Math.max(0, (timeLeft / QUESTION_TIME) * 100);

    return (
        <div className="flex flex-col min-h-screen bg-[#ffd7b5] dark:bg-gray-900 px-4 py-6 sm:px-6 font-sans relative overflow-hidden">
            <AnimatedBackground />

            <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center relative z-20">

                {/* Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/20"
                >

                    {/* Tournament Badge */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                            <span>🏆</span>
                            <span>Tournament Mode</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt="User avatar"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-base sm:text-lg leading-tight">
                                    @{user.username}
                                </p>
                                <p className="text-xs text-primary font-semibold tracking-wide uppercase">Concero × Lanca</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Question</span>
                            <span className="font-black text-3xl text-accent leading-none">
                                {index + 1}<span className="text-lg text-gray-400 font-medium">/{quizQuestions.length}</span>
                            </span>
                        </div>
                    </div>

                    {/* Timer bar */}
                    <div className="w-full h-3 bg-gray-100 rounded-full mb-8 overflow-hidden shadow-inner">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-red-500"
                            style={{ width: `${progressPct}%` }}
                            transition={{ ease: "linear", duration: 0.9 }}
                        />
                    </div>

                    {/* Question & Options */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 leading-snug">
                                {currentQ.question}
                            </h3>

                            <div className="space-y-3">
                                {currentQ.options.map((opt, i) => {
                                    const isCorrect = opt === currentQ.answer;
                                    const isSelected = opt === selected;
                                    const answered = selected !== null;

                                    let base =
                                        "w-full text-left p-4 rounded-xl border-2 text-base font-medium transition-all duration-200 relative overflow-hidden ";

                                    if (!answered) {
                                        base +=
                                            "bg-white border-gray-100 hover:border-primary/50 hover:bg-orange-50 hover:shadow-md cursor-pointer text-gray-700";
                                    } else {
                                        if (selected === "__TIMED_OUT__") {
                                            base += isCorrect
                                                ? "bg-green-50 border-green-500 text-green-800"
                                                : "bg-gray-50 border-gray-200 text-gray-400";
                                        } else {
                                            if (isSelected && isCorrect)
                                                base += "bg-green-500 text-white border-green-600 shadow-lg scale-[1.02]";
                                            else if (isSelected && !isCorrect)
                                                base += "bg-red-500 text-white border-red-600 shadow-lg scale-[1.02]";
                                            else if (isCorrect)
                                                base += "bg-green-50 border-green-500 text-green-800";
                                            else base += "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                                        }
                                    }

                                    return (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={base}
                                            onClick={() => handleAnswer(opt)}
                                            disabled={answered}
                                        >
                                            <span className="relative z-20 flex items-center justify-between">
                                                {opt}
                                                {answered && isCorrect && (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                )}
                                                {answered && isSelected && !isCorrect && (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                )}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Finish Button */}
                            {index + 1 === quizQuestions.length && selected !== null && (
                                <div className="mt-8 flex justify-center">
                                    <motion.button
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={finishQuiz}
                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl ring-4 ring-yellow-400/20"
                                    >
                                        🏆 Finish Tournament &rarr;
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-6 font-medium relative z-20">
                Made with ❤️ by{" "}
                <a
                    href="https://x.com/adedir2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#fe7f2d] hover:underline"
                >
                    @adedir2
                </a>
            </p>
            {/* Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                confirmText="OK"
                isAlert={modalConfig.isAlert}
            />
        </div>
    );
}
