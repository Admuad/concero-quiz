// src/pages/Leaderboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../utils/avatar";
import AnimatedBackground from "../components/AnimatedBackground";
import ThemeToggle from "../components/ThemeToggle";
import { fetchWithRetry } from "../utils/api";

const TAB_KEYS = ["daily", "weekly", "monthly", "all", "tournament"];
const TAB_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  all: "All time",
  tournament: "Tournament",
};

function parseDateSafe(d) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function startOfNDaysAgoUTC(n) {
  const s = startOfTodayUTC();
  s.setUTCDate(s.getUTCDate() - n + 1);
  return s;
}

// 🔥 YouTube-style shimmer skeleton loader
function LoadingSkeleton() {
  return (
    <div className="py-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 sm:px-6 py-4 animate-pulse"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex-1 space-y-2">
              <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-20 h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-10 h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeUntilStart, setTimeUntilStart] = useState("");
  const itemsPerPage = 10;

  // Tournament start/end time from environment variable
  const tournamentStart = useMemo(() => {
    const startTime = import.meta.env.VITE_TOURNAMENT_START_UTC;
    return startTime ? new Date(startTime) : null;
  }, []);

  const tournamentEnd = useMemo(() => {
    const endTimeStr = import.meta.env.VITE_TOURNAMENT_END_UTC;
    if (endTimeStr) return new Date(endTimeStr);

    if (!tournamentStart) return null;
    const endDate = new Date(tournamentStart);
    endDate.setUTCDate(endDate.getUTCDate() + 7); // Default 7 days if not set
    return endDate;
  }, [tournamentStart]);

  const beforeStart = tournamentStart && Date.now() < tournamentStart.getTime();

  // Countdown timer
  useEffect(() => {
    if (!tournamentStart || !beforeStart) return;

    function updateCountdown() {
      const now = Date.now();
      const diff = tournamentStart.getTime() - now;

      if (diff <= 0) {
        setTimeUntilStart("");
        window.location.reload(); // Refresh when tournament starts
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let countdown = "";
      if (days > 0) countdown += `${days}d `;
      if (hours > 0 || days > 0) countdown += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) countdown += `${minutes}m `;
      countdown += `${seconds}s`;

      setTimeUntilStart(countdown);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [tournamentStart, beforeStart]);

  useEffect(() => {
    let mounted = true;
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);
        // Pass activeTab as timeframe query param
        const res = await fetchWithRetry(`https://concero-lanca-backend.onrender.com/api/leaderboard?timeframe=${activeTab}`);

        // fetchWithRetry handles throwing for 5xx/429, but returns 4xx response object.
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!mounted) return;
        const normalized = (data || []).map((p) => {
          const created = p.createdAt || p.updatedAt || p.created_at || p.date || null;
          return {
            ...p,
            createdAtRaw: created,
            createdAt: parseDateSafe(created),
          };
        });
        setLeaders(normalized);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLeaderboard();
    return () => {
      mounted = false;
    };
  }, [activeTab]);





  // No client-side filtering needed anymore
  const list = leaders;

  // Reset pagination on tab switch
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const paginatedList = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fadeSlide = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="min-h-screen bg-[#ffd7b5] dark:bg-gray-900 px-3 sm:px-6 py-10 relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col relative z-20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe7f2d] to-[#233d4d] text-white py-6 px-4 relative">
          <div className="flex items-center justify-center relative">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 z-10"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-semibold hidden sm:inline">Back</span>
            </button>

            {/* Title Container with padding to prevent overlap */}
            <div className="text-center w-full px-12 sm:px-0">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Concero × Lanca Leaderboard</h1>
              <p className="text-sm sm:text-base text-[#fff]/90 mt-1">
                Top players ranked by IQ
              </p>
            </div>

            {/* Theme Toggle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <LayoutGroup>
            <div className="flex justify-center gap-3 sm:gap-5 flex-wrap relative">
              {TAB_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold transition ${activeTab === key
                    ? "text-[#fe7f2d]"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#233d4d] dark:hover:text-[#fe7f2d]"
                    }`}
                >
                  {TAB_LABELS[key]}
                  {activeTab === key && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-[#fe7f2d] to-[#233d4d] rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 flex-1">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="py-12 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : activeTab === "tournament" && beforeStart ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Tournament Hasn't Started Yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Starts {tournamentStart.toLocaleString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
              <div className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 px-8 py-4 rounded-xl shadow-md">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Starts in</p>
                <p className="text-3xl font-bold font-mono text-gray-800 dark:text-gray-100">{timeUntilStart || "Calculating..."}</p>
              </div>
            </div>
          ) : list.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <p className="text-gray-600 dark:text-gray-300 font-semibold">No results for this period.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Try switching to "All time".</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div key={`${activeTab}-${currentPage}`} {...fadeSlide}>
                  {paginatedList.map((player, idx) => {
                    const rank = (currentPage - 1) * itemsPerPage + idx + 1;
                    const created = player.createdAt;
                    const dateStr = created
                      ? created.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "—";

                    return (
                      <div
                        key={player.username + (player._id || idx)}
                        className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition relative"
                      >
                        {idx !== paginatedList.length - 1 && (
                          <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-100 dark:bg-gray-700" />
                        )}

                        <div className="flex items-center gap-4">
                          <div className="w-8 text-center font-bold text-gray-700 dark:text-gray-300">{rank}</div>

                          <img
                            src={getAvatarUrl(player.username)}
                            alt={player.username}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#fe7f2d] object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />

                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base flex items-center gap-2">
                              @{player.username}
                              {player.isTournament && (
                                <span className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                  🏆 Cup
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{dateStr}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold text-[#fe7f2d]">
                            {player.IQ ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {player.correct}/{player.totalQuestions ?? "-"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-5 border-t border-gray-100 dark:border-gray-700">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-1 text-sm rounded-md ${currentPage === 1
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-[#fe7f2d]/10 dark:bg-[#fe7f2d]/20 text-[#fe7f2d] hover:bg-[#fe7f2d]/20 dark:hover:bg-[#fe7f2d]/30"
                      }`}
                  >
                    Prev
                  </button>

                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-3 py-1 text-sm rounded-md ${currentPage === totalPages
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-[#fe7f2d]/10 dark:bg-[#fe7f2d]/20 text-[#fe7f2d] hover:bg-[#fe7f2d]/20 dark:hover:bg-[#fe7f2d]/30"
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6 relative z-20">
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
