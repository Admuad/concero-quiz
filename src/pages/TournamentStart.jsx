// src/pages/TournamentStart.jsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import Countdown from "../components/Countdown";

export default function TournamentStart() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user;

    const [status, setStatus] = React.useState("loading");
    const [hasPlayed, setHasPlayed] = React.useState(false);

    // Fetch tournament status and check participation
    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                // 1. Get Tournament Status
                const statusRes = await fetch("https://concero-lanca-backend.onrender.com/api/tournament-status");
                const statusData = await statusRes.json();
                setStatus(statusData.status);

                // 2. Check if user played
                if (user) {
                    const playedRes = await fetch("https://concero-lanca-backend.onrender.com/api/tournament-check", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: user.username }),
                    });
                    const playedData = await playedRes.json();
                    setHasPlayed(playedData.hasPlayed);
                }
            } catch (error) {
                console.error("Error checking tournament:", error);
                setStatus("error");
            }
        };

        checkStatus();
    }, [user]);

    const tournamentStatus = status; // Use state instead of memo
    const [startTime, setStartTime] = React.useState(null);

    React.useEffect(() => {
        const fetchTime = async () => {
            try {
                const res = await fetch("https://concero-lanca-backend.onrender.com/api/tournament-status");
                const data = await res.json();
                if (data.startTime) setStartTime(new Date(data.startTime));
            } catch (e) { console.error(e); }
        };
        fetchTime();
    }, []);

    const handleStartTournament = () => {
        if (user) {
            if (hasPlayed) return;
            navigate("/tournament", { state: { user } });
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="relative min-h-screen bg-[#ffd7b5] overflow-hidden font-sans text-gray-800 flex flex-col items-center justify-center px-4">
            {/* Background Animation */}
            <AnimatedBackground />

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 max-w-lg w-full border border-white/50 pointer-events-auto"
            >
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg mb-3"
                    >
                        🏆 Official Tournament
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                        Concero × Lanca Tournament
                    </h1>
                    <p className="text-base text-gray-600 font-medium px-4">
                        Compete for glory and get CERs on Concero discord server
                    </p>
                </div>

                {/* Rules Section */}
                <div className="bg-orange-50/80 rounded-2xl p-5 mb-6 border border-orange-100 text-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">📜</span> Tournament Rules
                    </h3>
                    <ul className="space-y-2.5 text-gray-700 font-medium">
                        <li className="flex items-start gap-3">
                            <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">1</span>
                            <span>You have <strong>one attempt</strong> only. Make it count!</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">2</span>
                            <span>15 challenging questions from the tournament pool.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">3</span>
                            <span>15 seconds per question. Speed earns bonus points.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">4</span>
                            <span>Top scorers will be featured on the Tournament Leaderboard.</span>
                        </li>
                    </ul>
                </div>

                {/* Start Button */}
                <div className="flex justify-center">
                    {tournamentStatus === "active" && !hasPlayed ? (
                        <motion.button
                            onClick={handleStartTournament}
                            animate={{
                                y: [0, -8, 0],
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0px 10px 15px -3px rgba(254, 127, 45, 0.3)",
                                    "0px 20px 25px -5px rgba(254, 127, 45, 0.5)",
                                    "0px 10px 15px -3px rgba(254, 127, 45, 0.3)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#fe7f2d] to-[#fcca46] text-white font-black text-lg py-4 px-10 rounded-full shadow-xl border-4 border-white/30 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                START TOURNAMENT 🚀
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                    ) : (
                        <button
                            disabled
                            className="bg-gray-300 text-gray-500 font-bold text-xl py-4 px-10 rounded-full cursor-not-allowed"
                        >
                            {hasPlayed
                                ? "Already Participated ✅"
                                : tournamentStatus === "upcoming"
                                    ? "Coming Soon"
                                    : tournamentStatus === "loading"
                                        ? "Loading..."
                                        : "Tournament Ended"}
                        </button>
                    )}
                </div>

                {/* Countdown for Upcoming */}
                {tournamentStatus === "upcoming" && startTime && (
                    <div className="mt-8">
                        <p className="text-center text-gray-600 font-bold mb-2 uppercase tracking-widest text-xs">Tournament Starts In</p>
                        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20">
                            <Countdown targetDate={startTime} onComplete={() => setStatus("active")} />
                        </div>
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-[#fe7f2d] font-semibold text-sm transition-colors"
                    >
                        &larr; Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
