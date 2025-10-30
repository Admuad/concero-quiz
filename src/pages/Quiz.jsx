// src/pages/Quiz.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import questions from "../data/questions";

export default function Quiz() {
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

  const autoAdvanceRef = useRef(null);
  const timerRef = useRef(null);

  // Load questions and session check
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const picked = [...questions]
      .sort(() => 0.5 - Math.random())
      .slice(0, TOTAL_QUESTIONS);

    setQuizQuestions(picked);
    setIndex(0);
    setSelected(null);
    setScoreCount(0);
    setTotalPoints(0);
    setTimeLeft(QUESTION_TIME);
  }, [user, navigate]);

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

    const result = {
      correct: scoreCount,
      totalPoints,
      IQ,
      totalQuestions: TOTAL_QUESTIONS,
    };

    try {
      const response = await fetch("https://concero-lanca-backend.onrender.com/api/submitResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          IQ: result.IQ,
          correct: result.correct,
          totalQuestions: result.totalQuestions,
        }),
      });

      if (!response.ok) {
        console.error("❌ Failed to save result:", response.statusText);
      } else {
        console.log("✅ Result saved successfully!");
      }
    } catch (error) {
      console.error("❌ Error submitting result:", error);
    }

    navigate("/result", { state: { result, user } });
  };


  if (!quizQuestions.length) {
    return (
      <div className="text-center mt-10 text-gray-700 font-semibold">
        Loading quiz...
      </div>
    );
  }

  const progressPct = Math.max(0, (timeLeft / QUESTION_TIME) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-5 sm:p-8 border border-gray-200 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#fe7f2d]"
            />
            <div>
              <p className="font-semibold text-gray-700 text-sm sm:text-base">
                @{user.username}
              </p>
              <p className="text-xs text-gray-500">Concero × Lanca Quiz</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-[#fe7f2d]">
              Q{index + 1}/{quizQuestions.length}
            </span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-2 bg-gray-200 rounded mb-5 overflow-hidden">
          <motion.div
            className="h-2 rounded bg-gradient-to-r from-[#fe7f2d] to-[#233d4d]"
            style={{ width: `${progressPct}%` }}
            transition={{ ease: "linear", duration: 0.9 }}
          />
        </div>

        {/* Question & Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isCorrect = opt === currentQ.answer;
                const isSelected = opt === selected;
                const answered = selected !== null;

                let base =
                  "w-full text-left p-3 sm:p-4 rounded-xl border text-sm sm:text-base transition duration-300 ";
                if (!answered) {
                  base +=
                    "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer";
                } else {
                  if (selected === "__TIMED_OUT__") {
                    base += isCorrect
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-gray-100 border-gray-200";
                  } else {
                    if (isSelected && isCorrect)
                      base += "bg-green-500 text-white border-green-600 shadow-md";
                    else if (isSelected && !isCorrect)
                      base += "bg-red-500 text-white border-red-600 shadow-md";
                    else if (isCorrect)
                      base += "bg-green-100 border-green-400 text-green-800";
                    else base += "bg-gray-100 border-gray-200";
                  }
                }

                return (
                  <button
                    key={i}
                    className={base}
                    onClick={() => handleAnswer(opt)}
                    disabled={answered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Finish Button */}
            {index + 1 === quizQuestions.length && selected !== null && (
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={finishQuiz}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#fe7f2d] to-[#233d4d] text-white font-semibold shadow-md"
                >
                  Finish Quiz
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="text-center text-xs sm:text-sm text-gray-600 mt-6">
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
