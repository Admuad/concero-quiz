// src/pages/Quiz.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import questions from "../data/beginnerQuestions";
import AnimatedBackground from "../components/AnimatedBackground";
import { fetchWithRetry } from "../utils/api";
import { shuffleArray } from "../utils/random";

export default function Quiz() {
  const TOTAL_QUESTIONS = 15;
  const QUESTION_TIME = 15;
  const AUTO_ADVANCE_DELAY = 1000;

  const navigate = useNavigate();
  const { state } = useLocation();
  const [user, setUser] = useState(state?.user || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      const savedUser = localStorage.getItem("quizUser");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem("quizUser");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);

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
      return;
    }

    const picked = shuffleArray(questions)
      .slice(0, TOTAL_QUESTIONS)
      .map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

    setQuizQuestions(picked);
    setIndex(0);
    setSelected(null);
    setScoreCount(0);
    setTotalPoints(0);
    setTimeLeft(QUESTION_TIME);
  }, [user]);

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
      const response = await fetchWithRetry("https://concero-lanca-backend.onrender.com/api/submitResult", {
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
      <div className="flex items-center justify-center min-h-screen bg-[#ffd7b5] dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-2xl font-bold animate-pulse relative z-20">Loading quiz...</div>
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
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-xl hover:shadow-2xl ring-4 ring-primary/20"
                  >
                    Finish Quiz &rarr;
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
    </div>
  );
}
