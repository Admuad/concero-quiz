// src/pages/Result.jsx
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import ConceroLogo from "../assets/concero-logo.png";
import WojakImage from "../assets/wojak.png";
import { useAvatar } from "../hooks/useAvatar";
import AnimatedBackground from "../components/AnimatedBackground";
import Toast from "../components/Toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
`;

const getIQRating = (iq) => {
  if (iq >= 130) return "Very Superior";
  if (iq >= 120) return "Superior";
  if (iq >= 110) return "Bright";
  if (iq >= 90) return "Average";
  if (iq >= 80) return "Low Average";
  return "Below Average";
};

const BellCurveGraph = ({ iq, avatarUrl, username }) => {
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 200;
  const BASELINE_Y = 170;
  const MIN_IQ = 55;
  const MAX_IQ = 145;

  const xPercent = Math.min(Math.max((iq - MIN_IQ) / (MAX_IQ - MIN_IQ), 0), 1);
  const xPos = xPercent * SVG_WIDTH;

  const curvePath = `
    M 0 ${BASELINE_Y} 
    C ${SVG_WIDTH * 0.25} ${BASELINE_Y}, 
      ${SVG_WIDTH * 0.35} 100, 
      ${SVG_WIDTH * 0.5} 100 
    S ${SVG_WIDTH * 0.75} ${BASELINE_Y}, 
      ${SVG_WIDTH} ${BASELINE_Y}
    Z
  `;

  const iqDivisions = [55, 70, 85, 100, 115, 130, 145];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-xl mx-auto mt-4 mb-2"
    >
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fe7f2d" />
            <stop offset="100%" stopColor="#ff9f5a" />
          </linearGradient>
        </defs>

        <path d={curvePath} fill="url(#curveGradient)" />

        {[85, 100, 115, 130].map((val) => {
          const x = ((val - MIN_IQ) / (MAX_IQ - MIN_IQ)) * SVG_WIDTH;
          return (
            <line
              key={val}
              x1={x}
              y1={BASELINE_Y}
              x2={x}
              y2={100}
              stroke="white"
              strokeWidth="1.5"
              opacity="0.5"
            />
          );
        })}

        <line x1="0" y1={BASELINE_Y} x2={SVG_WIDTH} y2={BASELINE_Y} stroke="#fe7f2d" strokeWidth="2" />

        {iqDivisions.map((label) => {
          const x = ((label - MIN_IQ) / (MAX_IQ - MIN_IQ)) * SVG_WIDTH;
          return (
            <text
              key={`label-${label}`}
              x={x}
              y={BASELINE_Y + 25}
              fontSize="14"
              textAnchor="middle"
              fill="#fe7f2d"
              fontWeight="bold"
              className="font-poppins"
            >
              {label}
            </text>
          );
        })}

        <line x1={xPos} y1={40} x2={xPos} y2={BASELINE_Y} stroke="#fe7f2d" strokeWidth="3" strokeDasharray="6 6" />
      </svg>

      <div
        className="absolute"
        style={{
          left: `calc(${xPercent * 100}% - 24px)`,
          top: "-4px",
        }}
      >
        <img
          src={avatarUrl}
          alt={username}
          className="w-12 h-12 rounded-full border-3 border-[#fe7f2d] shadow-lg object-cover bg-white"
        />
      </div>
    </motion.div>
  );
};

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(state?.result || null);
  const [user, setUser] = useState(state?.user || null);

  // Recover session if missing
  React.useEffect(() => {
    if (!user) {
      const savedUser = localStorage.getItem("quizUser");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // If result is also missing, we can't really do much but redirect to start or show error
          if (!result) {
            // Maybe they just refreshed result page? 
            // Without result data, we can't show score.
            // So we just stay here and let the "Missing data" block handle it, 
            // but at least we have the user.
          }
        } catch (e) {
          localStorage.removeItem("quizUser");
        }
      }
    }
  }, [user, result]);
  const cardRef = useRef(null);
  const { avatarUrl } = useAvatar(user?.username);
  const [isRestarting, setIsRestarting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  if (!result || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ffd7b5] dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center relative z-20">
          <p className="mb-4 text-lg">Missing data. Please restart the quiz.</p>
          <button
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { correct, IQ, totalQuestions } = result;
  const rating = getIQRating(IQ);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
    const link = document.createElement("a");
    link.download = "concero-lanca-quiz-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Image downloaded successfully!", "success");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `I scored ${IQ} on the Concero × Lanca Quiz built by @adedir2!
\nTry yours: https://concero-lanca-quiz.vercel.app
\n@concero_io - Secure cross-chain messaging protocol on the Chainlink stack.
\n@lanca_io - Secure bridge built on Concero Technology.`
    );
    showToast("Result copied to clipboard!", "success");
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    const text = encodeURIComponent(
      `I scored ${IQ} on the Concero × Lanca Quiz built by @adedir2!
\nTry yours: https://concero-lanca-quiz.vercel.app
\n@concero_io - Secure cross-chain messaging protocol on the Chainlink stack.
\n@lanca_io - Secure bridge built on Concero Technology.`
    );
    const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
    const link = document.createElement("a");
    link.download = "concero-lanca-quiz-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setTimeout(() => {
      showToast("Image downloaded! Please attach it to your tweet.", "info");
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    }, 500);
  };

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => navigate("/start", { state: { user } }), 600);
  };

  const handleLeaderboard = () => navigate("/leaderboard");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-start min-h-screen bg-[#ffd7b5] dark:bg-gray-900 px-4 py-6 sm:px-6 font-poppins relative overflow-hidden"
    >
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
      <AnimatedBackground />
      <style>{styles}</style>



      <motion.div
        ref={cardRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent shadow-2xl rounded-3xl w-full max-w-xl text-center relative z-20"
      >
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className={`p-4 flex items-center justify-between text-white ${result.isTournament ? "bg-gradient-to-r from-purple-600 to-indigo-700" : "bg-gradient-to-r from-[#fe7f2d] to-[#233d4d]"}`}>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl || user.avatar}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border-3 border-white/30"
              />
              <div className="text-left">
                <h1 className="text-xl font-bold leading-tight">@{user.username}</h1>
                <p className="text-xs opacity-90 font-medium">
                  {result.isTournament ? "Tournament Result 🏆" : "Concero × Lanca IQ Result"}
                </p>
              </div>
            </div>
            <img src={ConceroLogo} alt="Logo" className="w-10 h-10 object-contain opacity-90" />
          </div>

          <div className="pt-6 pb-3 px-4">
            <div className="flex items-baseline justify-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg text-gray-600 font-semibold">@{user.username} Concero × Lanca IQ score is:</span>
              <span className="text-4xl sm:text-5xl font-black text-[#fe7f2d] tracking-tight leading-none">{IQ}</span>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <img src={WojakImage} alt="Wojak" className="w-6 h-6" />
              <span className="text-lg font-bold text-[#fe7f2d]">{rating}</span>
            </div>
          </div>

          <BellCurveGraph iq={IQ} avatarUrl={avatarUrl || user.avatar} username={user.username} />

          <div className="py-3 text-gray-600 text-xs font-semibold border-t border-gray-100 bg-gray-50">
            You answered <span className="text-primary font-bold">{correct}</span> out of {totalQuestions} questions correctly.
          </div>
        </div>
      </motion.div>

      <div className="mt-8 w-full max-w-md space-y-3 px-2 relative z-20">
        {/* Primary Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full px-5 py-4 rounded-xl font-bold text-lg bg-black text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-white/10 flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share Result on X
        </motion.button>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-[#fe7f2d] text-white shadow-md hover:shadow-lg transition-all duration-200 border border-white/10"
          >
            Download Image
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-[#233d4d] text-white shadow-md hover:shadow-lg transition-all duration-200 border border-white/10"
          >
            Copy Text
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLeaderboard}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/20 transition-all duration-200 border border-white/40 dark:border-white/30 backdrop-blur-sm shadow-sm"
          >
            Leaderboard 🏆
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRestart}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/20 transition-all duration-200 border border-white/40 dark:border-white/30 backdrop-blur-sm shadow-sm flex items-center justify-center gap-2"
          >
            <span>Restart</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={isRestarting ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              whileHover={{ rotate: 180 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
          </motion.button>
        </div>
      </div>

      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-8 font-medium relative z-20">
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
    </motion.div>
  );
}
