import React, { useRef, useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import ConceroLogo from "../assets/concero-logo.png";
import WojakImage from "../assets/wojak.png";

// Font setup
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap');
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
`;

// IQ Rating helper
const getIQRating = (iq) => {
  if (iq >= 130) return "Very Superior";
  if (iq >= 120) return "Superior";
  if (iq >= 110) return "Bright";
  if (iq >= 90) return "Average";
  if (iq >= 80) return "Low Average";
  return "Below Average";
};

// Bell Curve component
const BellCurveGraph = ({ iq, avatarUrl, username }) => {
  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 180;
  const MIN_IQ = 55;
  const MAX_IQ = 145;
  const CURVE_COLOR = "url(#curveGradient)";
  const iqDivisions = [55, 70, 85, 100, 115, 130, 145];
  const xPercent = ((iq - MIN_IQ) / (MAX_IQ - MIN_IQ)) * 100;

  const curvePath = `M0 ${SVG_HEIGHT - 10} C ${
    SVG_WIDTH * 0.2
  } 10, ${SVG_WIDTH * 0.8} 10, ${SVG_WIDTH} ${SVG_HEIGHT - 10}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-xl mx-auto mt-6 sm:mt-8"
    >
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT + 30}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fe7f2d" />
            <stop offset="100%" stopColor="#233d4d" />
          </linearGradient>
        </defs>

        <line
          x1="0"
          y1={SVG_HEIGHT - 10}
          x2={SVG_WIDTH}
          y2={SVG_HEIGHT - 10}
          stroke="#ccc"
          strokeWidth="1"
        />

        <path
          d={`M0 ${SVG_HEIGHT} ${curvePath} L${SVG_WIDTH} ${SVG_HEIGHT} Z`}
          fill={CURVE_COLOR}
          opacity="0.85"
        />

        {iqDivisions.map((label) => {
          const x = ((label - MIN_IQ) / (MAX_IQ - MIN_IQ)) * SVG_WIDTH;
          return (
            label !== 55 &&
            label !== 145 && (
              <line
                key={label}
                x1={x}
                y1={SVG_HEIGHT * 0.25}
                x2={x}
                y2={SVG_HEIGHT - 10}
                stroke="#fff"
                strokeWidth="1.5"
              />
            )
          );
        })}

        {iqDivisions.map((label) => {
          const x = ((label - MIN_IQ) / (MAX_IQ - MIN_IQ)) * SVG_WIDTH;
          return (
            <text
              key={`label-${label}`}
              x={x}
              y={SVG_HEIGHT + 20}
              fontSize="13"
              textAnchor="middle"
              fill="#444"
              className="font-semibold font-poppins"
            >
              {label}
            </text>
          );
        })}

        <line
          x1={(xPercent / 100) * SVG_WIDTH}
          y1={SVG_HEIGHT - 10}
          x2={(xPercent / 100) * SVG_WIDTH}
          y2="10"
          stroke="#fe7f2d"
          strokeWidth="3"
          strokeDasharray="5 5"
        />
      </svg>

      {/* Avatar Overlay */}
      <div
        className="absolute"
        style={{
          left: `calc(${xPercent}% - 25px)`,
          top: "-10px",
        }}
      >
        <img
          src={
            avatarUrl ||
            `https://unavatar.io/x/${username}?fallback=https://avatars.githubusercontent.com/u/0?v=4`
          }
          alt={username}
          className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>
    </motion.div>
  );
};

// Main Component
export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { result, user } = state || {};
  const cardRef = useRef(null);
  const [avatarData, setAvatarData] = useState(null);

  // Avatar caching
  useEffect(() => {
    if (!user?.username) return;

    const cacheKey = `avatar_${user.username}`;
    const cachedAvatar = localStorage.getItem(cacheKey);

    if (cachedAvatar) {
      setAvatarData(cachedAvatar);
      return;
    }

    const imgUrl = `https://unavatar.io/x/${user.username}?fallback=https://avatars.githubusercontent.com/u/0?v=4`;

    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarData(reader.result);
          localStorage.setItem(cacheKey, reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => setAvatarData(null));
  }, [user?.username]);

  if (!result || !user) {
    return (
      <div className="text-center mt-10">
        <p>Missing data. Please restart the quiz.</p>
        <button
          className="mt-4 px-4 py-2 bg-accent text-white rounded-lg"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  const { correct, IQ, totalQuestions } = result;
  const rating = getIQRating(IQ);

  // Download Image
  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
    const link = document.createElement("a");
    link.download = "concero-lanca-quiz-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Copy & Share
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `I scored ${IQ} on the Concero × Lanca Quiz built by @adedir2!

Try yours: https://concero-lanca-quiz.vercel.app

@concero_io - Secure cross-chain messaging protocol on the Chainlink stack.

@lanca_io - Secure bridge built on Concero Technology.`
    );
    alert("Result copied!");
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      `I scored ${IQ} on the Concero × Lanca Quiz built by @adedir2!

Try yours: https://concero-lanca-quiz.vercel.app

@concero_io - Secure cross-chain messaging protocol on the Chainlink stack.

@lanca_io - Secure bridge built on Concero Technology.`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 py-6 sm:px-6 font-poppins"
    >
      <style>{styles}</style>

      {/* Result Card */}
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-lg text-center overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe7f2d] to-[#233d4d] p-4 flex items-center justify-between text-white">
          <div className="flex items-center">
            <img
              src={
                avatarData ||
                `https://unavatar.io/x/${user.username}?fallback=https://avatars.githubusercontent.com/u/0?v=4`
              }
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-bold leading-tight">@{user.username}</h1>
              <p className="text-xs opacity-80">Concero × Lanca IQ Result</p>
            </div>
          </div>
          <img src={ConceroLogo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        </div>

        {/* IQ Score */}
        <div className="py-6 px-4">
          <p className="text-gray-700 font-semibold text-base sm:text-lg">
            @{user.username}’s IQ score is:
          </p>
          <p className="text-5xl font-extrabold text-[#fe7f2d] mt-2">{IQ}</p>
          <p className="text-xl font-semibold text-[#233d4d] mt-2 flex items-center justify-center">
            <img src={WojakImage} alt="Wojak" className="w-6 h-6 mr-2" />
            {rating}
          </p>
        </div>

        {/* Graph */}
        <BellCurveGraph iq={IQ} avatarUrl={avatarData} username={user.username} />

        {/* Footer Info */}
        <div className="py-4 text-gray-700 text-sm font-semibold border-t">
          You answered {correct} out of {totalQuestions} questions correctly.
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleCopy}
          className="px-5 py-2 bg-gray-800 text-white rounded-lg font-semibold w-36"
        >
          Copy Text
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleDownload}
          className="px-5 py-2 bg-[#fe7f2d] text-white rounded-lg font-semibold w-36"
        >
          Download
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleShare}
          className="px-5 py-2 bg-[#233d4d] text-white rounded-lg font-semibold w-36"
        >
          Share to X
        </motion.button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs sm:text-sm text-gray-600 mt-8">
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
    </motion.div>
  );
}
