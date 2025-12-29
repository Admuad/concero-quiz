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

  // Current time state for reactivity
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tournamentStatus = useMemo(() => {
    if (!tournamentStart || !tournamentEnd) return "active"; // Default to active if no dates
    if (currentTime < tournamentStart.getTime()) return "upcoming";
    if (currentTime > tournamentEnd.getTime()) return "ended";
    return "active";
  }, [tournamentStart, tournamentEnd, currentTime]);

  // Countdown logic for button
  const timeUntilStart = useMemo(() => {
    if (tournamentStatus !== "upcoming" || !tournamentStart) return "";

    const diff = tournamentStart.getTime() - currentTime;
    if (diff <= 0) return "";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let countdown = "";
    if (days > 0) countdown += `${days}d `;
    if (hours > 0 || days > 0) countdown += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) countdown += `${minutes}m `;
    countdown += `${seconds}s`;

    return countdown;
  }, [tournamentStatus, tournamentStart, currentTime]);

  const handleStart = () => {
    if (user) navigate("/quiz", { state: { user } });
    else navigate("/login");
  };

  const handleReadConcero = () =>
    window.open("https://docs.concero.io/", "_blank");

  const handleReadLanca = () =>
    window.open("https://docs.lanca.io/", "_blank");

  // Discord Handle Logic
  const [isDiscordModalOpen, setIsDiscordModalOpen] = React.useState(false);
  const [discordHandleInput, setDiscordHandleInput] = React.useState("");
  const [isConfirmingDiscord, setIsConfirmingDiscord] = React.useState(false);

  const handleTournament = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user already has a discord handle saved
    if (user.discordHandle) {
      navigate("/tournament-start", { state: { user } });
    } else {
      // Open collection modal
      setDiscordHandleInput("");
      setIsConfirmingDiscord(false);
      setIsDiscordModalOpen(true);
    }
  };

  const submitDiscordHandle = () => {
    if (!discordHandleInput.trim()) return;
    setIsConfirmingDiscord(true);
  };

  const confirmDiscordHandle = () => {
    const updatedUser = { ...user, discordHandle: discordHandleInput.trim() };

    // Update local storage and state
    localStorage.setItem("quizUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Close modal and navigate
    setIsDiscordModalOpen(false);
    navigate("/tournament-start", { state: { user: updatedUser } });
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
            <li className="hover:translate-x-1 transition-transform duration-200">Each question has a 60-second timer.</li>
            <li className="hover:translate-x-1 transition-transform duration-200">Answer quickly and correctly to score higher.</li>
            <li className="hover:translate-x-1 transition-transform duration-200">Your IQ will be calculated based on speed and accuracy.</li>
          </ul>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 mt-8">
          {/* Dynamic Buttons based on Tournament Status */}
          {/* Dynamic Buttons based on Tournament Status */}
          {tournamentStatus === "active" || tournamentStatus === "upcoming" ? (
            <>
              {/* Tournament Button - Primary (Active or Upcoming) */}
              <motion.button
                whileHover={tournamentStatus === "active" ? { scale: 1.02, y: -2 } : {}}
                whileTap={tournamentStatus === "active" ? { scale: 0.98 } : {}}
                onClick={tournamentStatus === "active" ? handleTournament : undefined}
                disabled={tournamentStatus !== "active"}
                className={`w-full font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 text-lg flex items-center justify-center gap-2 border border-white/10 relative overflow-hidden ${tournamentStatus === "active"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-purple-500/30"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
              >
                {tournamentStatus === "active" && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                )}

                <span className="relative z-10 text-2xl">🏆</span>

                {tournamentStatus === "active" ? (
                  <span className="relative z-10 font-bold">Join Tournament (Live!)</span>
                ) : (
                  <div className="flex flex-col items-center leading-tight relative z-10">
                    <span className="text-xs sm:text-sm uppercase tracking-wider opacity-90 mb-0.5">Tournament Starts In</span>
                    <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest">
                      {timeUntilStart || "--:--:--"}
                    </span>
                  </div>
                )}
              </motion.button>

              {/* Practice Mode Button - Secondary */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full bg-transparent text-gray-700 dark:text-gray-300 font-bold py-3.5 px-8 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-[#fe7f2d] hover:text-[#fe7f2d] dark:hover:border-[#fe7f2d] dark:hover:text-[#fe7f2d] hover:bg-orange-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                Practice Mode
              </motion.button>
            </>
          ) : (
            <>
              {/* Normal Start Quiz Button - Primary (When no tournament/ended) */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="bg-gradient-to-r from-[#fe7f2d] to-[#ff9f5a] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-lg border border-white/20"
              >
                Start Quiz
              </motion.button>

              {/* Optional: Show Ended status if needed, or just hide it to reduce clutter */}
              {tournamentStatus === "ended" && (
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  🏆 Tournament Ended
                </div>
              )}
            </>
          )}

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

      {/* Discord Collection Modal */}
      {isDiscordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          >
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#5865F2]/10 text-[#5865F2] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.955 2.419-2.176 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.946 2.419-2.176 2.419z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {isConfirmingDiscord ? "Confirm Handle" : "Discord Handle"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isConfirmingDiscord
                  ? "Is this your correct Discord handle?"
                  : "Enter your Discord handle so we can contact you for prizes!"}
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              {isConfirmingDiscord ? (
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                  <span className="font-mono text-lg font-bold text-[#5865F2]">{discordHandleInput}</span>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center font-medium focus:ring-2 focus:ring-[#5865F2] focus:border-[#5865F2] outline-none transition-all"
                    placeholder="username#1234 or username"
                    value={discordHandleInput}
                    onChange={(e) => setDiscordHandleInput(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isConfirmingDiscord ? (
                <>
                  <button
                    onClick={() => setIsConfirmingDiscord(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={confirmDiscordHandle}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-lg shadow-[#5865F2]/30 transition-all"
                  >
                    Confirm & Join
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsDiscordModalOpen(false)}
                    className="px-4 py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitDiscordHandle}
                    disabled={!discordHandleInput.trim()}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-lg shadow-[#5865F2]/30 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

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
