// src/pages/Start.jsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ConceroLogo from "../assets/concero-logo.png";
import LancaLogo from "../assets/lanca-logo.png";
import ThemeToggle from "../components/ThemeToggle";
import AnimatedBackground from "../components/AnimatedBackground";
import Modal from "../components/Modal";

export default function Start() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [user, setUser] = React.useState(state?.user || null);

  React.useEffect(() => {
    if (!user) {
      const savedUser = localStorage.getItem("quizUser");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem("quizUser");
        }
      }
    }
  }, [user]);

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

  const tournamentStatus = useMemo(() => {
    if (!tournamentStart || !tournamentEnd) return "active"; // Default to active if no dates
    const now = Date.now();
    if (now < tournamentStart.getTime()) return "upcoming";
    if (now > tournamentEnd.getTime()) return "ended";
    return "active";
  }, [tournamentStart, tournamentEnd]);

  const handleStart = () => {
    if (user) navigate("/quiz", { state: { user } });
    else navigate("/login");
  };

  const handleReadConcero = () =>
    window.open("https://docs.concero.io/", "_blank");

  const handleReadLanca = () =>
    window.open("https://docs.lanca.io/", "_blank");

  const handleTournament = () => {
    if (user) navigate("/tournament-start", { state: { user } });
    else navigate("/login");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("quizUser");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Session expired. Please log in again.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#ffd7b5] dark:bg-gray-900 text-gray-900 dark:text-white text-center px-5 py-6 relative overflow-hidden">
      <AnimatedBackground />

      {/* Theme Toggle */}
      {/* Top Bar */}
      <div className="absolute top-6 right-6 z-50 flex gap-3 items-center">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mx-auto space-y-6 sm:space-y-8 flex-grow relative z-20"
      >
        {/* Header with Single Logo */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src={ConceroLogo}
              alt="Concero"
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
            <img
              src={LancaLogo}
              alt="Lanca"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Concero × Lanca Quiz
          </h1>
        </div>

        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed px-2">
          Welcome @{user.username}! Read the quick instructions below before
          starting.
        </p>

        {/* Instructions - Glassy Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 p-5 sm:p-6 rounded-2xl text-sm sm:text-base text-gray-800 dark:text-gray-100 shadow-2xl border border-white/40 dark:border-gray-700/40"
        >
          {/* Glassy shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

          <ul className="list-disc list-inside text-left space-y-2 relative z-10">
            <li className="hover:translate-x-1 transition-transform duration-200">You'll get 15 random questions.</li>
            <li className="hover:translate-x-1 transition-transform duration-200">Each question has a 15-second timer.</li>
            <li className="hover:translate-x-1 transition-transform duration-200">Answer quickly and correctly to score higher.</li>
            <li className="hover:translate-x-1 transition-transform duration-200">Your IQ will be calculated based on speed and accuracy.</li>
          </ul>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 mt-8">
          {/* Start Quiz */}
          {/* Start Quiz */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="bg-gradient-to-r from-[#fe7f2d] to-[#ff9f5a] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-lg border border-white/20"
          >
            Start Quiz
          </motion.button>

          {/* Tournament Button */}
          {/* Tournament Button */}
          <motion.button
            whileHover={{ scale: tournamentStatus === "active" ? 1.02 : 1, y: tournamentStatus === "active" ? -2 : 0 }}
            whileTap={{ scale: tournamentStatus === "active" ? 0.98 : 1 }}
            onClick={tournamentStatus === "active" ? handleTournament : undefined}
            disabled={tournamentStatus !== "active"}
            className={`font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all duration-300 text-lg flex items-center justify-center gap-2 border border-white/10 ${tournamentStatus === "active"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-purple-500/30 cursor-pointer"
              : tournamentStatus === "upcoming"
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
              }`}
          >
            <span>🏆</span>
            {tournamentStatus === "active" && "Join Tournament"}
            {tournamentStatus === "upcoming" && "Tournament Coming Soon"}
            {tournamentStatus === "ended" && "Tournament Ended"}
          </motion.button>

          {/* View Leaderboard */}
          {/* View Leaderboard */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLeaderboard}
            className="bg-transparent text-gray-800 dark:text-white font-bold py-3.5 px-8 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
          >
            View Leaderboard
          </motion.button>

          {/* Docs Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReadConcero}
              className="flex-1 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5"
            >
              Read about Concero
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReadLanca}
              className="flex-1 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5"
            >
              Read about Lanca
            </motion.button>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoutClick}
            className="w-full text-red-500/70 hover:text-red-600 dark:text-red-400/70 dark:hover:text-red-400 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm mt-2"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Log Out"
        message="Are you sure you want to log out? You will need to sign in again to access the quiz."
        onConfirm={confirmLogout}
        confirmText="Log Out"
        cancelText="Cancel"
      />

      {/* Footer */}
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-6 relative z-20">
        Made with ❤️ by{" "}
        <a
          href="https://x.com/adedir2"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#fe7f2d] hover:underline"
        >
          @adedir2
        </a>
      </p>
    </div>
  );
}
