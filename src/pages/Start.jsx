// src/pages/Start.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ConceroLogo from "../assets/concero-logo.png";
import LancaLogo from "../assets/lanca-logo.png";

export default function Start() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  const handleStart = () => {
    if (user) navigate("/quiz", { state: { user } });
    else navigate("/login");
  };

  const handleReadConcero = () =>
    window.open("https://docs.concero.io/", "_blank");

  const handleReadLanca = () =>
    window.open("https://concero.io/lanca_whitepaper.pdf", "_blank");

  const handleLeaderboard = () => navigate("/leaderboard");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <p className="text-gray-700 mb-4">
          Session expired. Please log in again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-accent to-primary text-white text-center px-5 py-6">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mx-auto space-y-8 flex-grow"
      >
        {/* Logos */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6">
          <img
            src={ConceroLogo}
            alt="Concero"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
          <span className="text-2xl sm:text-3xl font-bold">×</span>
          <img
            src={LancaLogo}
            alt="Lanca"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug">
          Concero × Lanca Quiz
        </h1>
        <p className="text-base sm:text-lg text-gray-100 leading-relaxed">
          Welcome @{user.username}! Read the quick instructions below before
          starting.
        </p>

        {/* Instructions */}
        <div className="bg-white bg-opacity-10 p-4 sm:p-5 rounded-xl text-sm sm:text-base text-gray-100 shadow-md">
          <ul className="list-disc list-inside text-left space-y-1">
            <li>You’ll get 15 random questions.</li>
            <li>Each question has a 15-second timer.</li>
            <li>Answer quickly and correctly to score higher.</li>
            <li>Your IQ will be calculated based on speed and accuracy.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 mt-8">
          {/* Start Quiz */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="bg-white text-[#233d4d] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-lg"
          >
            Start Quiz
          </motion.button>

          {/* View Leaderboard */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLeaderboard}
            className="bg-white/95 text-[#fe7f2d] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/50 hover:bg-white"
          >
            View Leaderboard
          </motion.button>

          {/* Docs Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReadConcero}
              className="flex-1 bg-[#233d4d] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#1a2d3a] transition-all duration-300 border border-white/10"
            >
              Read about Concero
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReadLanca}
              className="flex-1 bg-[#233d4d] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#1a2d3a] transition-all duration-300 border border-white/10"
            >
              Read about Lanca
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-xs sm:text-sm text-white mt-6 opacity-80">
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
