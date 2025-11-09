// src/pages/Leaderboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const TAB_KEYS = ["daily", "weekly", "monthly", "all"];
const TAB_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  all: "All time",
};

function parseDateSafe(d) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfNDaysAgo(n) {
  const s = startOfToday();
  s.setDate(s.getDate() - n + 1);
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
            <div className="w-8 h-5 bg-gray-200 rounded"></div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"></div>

            <div className="flex-1 space-y-2">
              <div className="w-32 h-3 bg-gray-200 rounded"></div>
              <div className="w-20 h-3 bg-gray-100 rounded"></div>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="w-8 h-3 bg-gray-200 rounded"></div>
            <div className="w-10 h-3 bg-gray-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let mounted = true;
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://concero-lanca-backend.onrender.com/api/leaderboard");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const normalized = (data || []).map((p) => {
          const created = p.createdAt || p.updatedAt || p.created_at || null;
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
  }, []);

  const filtered = useMemo(() => {
    const sToday = startOfToday();
    const s7 = startOfNDaysAgo(7);
    const s30 = startOfNDaysAgo(30);

    const byTab = {
      daily: leaders.filter((p) => p.createdAt && p.createdAt >= sToday),
      weekly: leaders.filter((p) => p.createdAt && p.createdAt >= s7),
      monthly: leaders.filter((p) => p.createdAt && p.createdAt >= s30),
      all: leaders.slice(),
    };

    for (const k of Object.keys(byTab)) {
      byTab[k].sort((a, b) => (b.IQ || 0) - (a.IQ || 0));
    }

    return byTab;
  }, [leaders]);

  const list = filtered[activeTab] || [];

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
    <div className="min-h-screen bg-gradient-to-br from-[#fe7f2d]/10 to-[#233d4d]/10 px-3 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe7f2d] to-[#233d4d] text-white text-center py-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Concero × Lanca Leaderboard</h1>
          <p className="text-sm sm:text-base text-[#fff]/90 mt-1">
            Top players ranked by IQ
          </p>
        </div>

        {/* Tabs */}
        <div className="relative px-4 sm:px-6 py-4 border-b border-gray-100">
          <LayoutGroup>
            <div className="flex justify-center gap-3 sm:gap-5 flex-wrap relative">
              {TAB_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold transition ${
                    activeTab === key
                      ? "text-[#fe7f2d]"
                      : "text-gray-500 hover:text-[#233d4d]"
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
        <div className="bg-white flex-1">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="py-12 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : list.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <p className="text-gray-600 font-semibold">No results for this period.</p>
              <p className="text-xs text-gray-400 mt-2">Try switching to “All time”.</p>
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
                        className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition relative"
                      >
                        {idx !== paginatedList.length - 1 && (
                          <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-100" />
                        )}

                        <div className="flex items-center gap-4">
                          <div className="w-8 text-center font-bold text-gray-700">{rank}</div>

                          <img
                            src={`https://unavatar.io/x/${player.username}`}
                            alt={player.username}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#fe7f2d] object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />

                          <div>
                            <div className="font-semibold text-gray-800 text-sm sm:text-base">
                              @{player.username}
                            </div>
                            <div className="text-xs text-gray-500">{dateStr}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold text-[#fe7f2d]">
                            {player.IQ ?? "—"}
                          </div>
                          <div className="text-xs text-gray-500">
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
                <div className="flex justify-center items-center gap-2 py-5 border-t border-gray-100">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#fe7f2d]/10 text-[#fe7f2d] hover:bg-[#fe7f2d]/20"
                    }`}
                  >
                    Prev
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#fe7f2d]/10 text-[#fe7f2d] hover:bg-[#fe7f2d]/20"
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

      <p className="text-center text-xs text-gray-600 mt-6">
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
