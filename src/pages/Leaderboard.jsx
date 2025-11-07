// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("https://concero-lanca-backend.onrender.com/api/leaderboard");
        const data = await res.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200 w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#233d4d]">
          🏆 Leaderboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading leaderboard...</p>
        ) : players.length === 0 ? (
          <p className="text-center text-gray-600">No results yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#fe7f2d] text-white">
                <th className="py-2 px-3 rounded-tl-xl text-left">Rank</th>
                <th className="py-2 px-3 text-left">Username</th>
                <th className="py-2 px-3 text-left">IQ</th>
                <th className="py-2 px-3 rounded-tr-xl text-left">Correct</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3 font-semibold">{i + 1}</td>
                  <td className="py-2 px-3">@{p.username}</td>
                  <td className="py-2 px-3">{p.IQ}</td>
                  <td className="py-2 px-3">{p.correct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
