// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.replace("@", "").trim();
    if (!cleanUsername) {
      setError("Please enter your X username.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://unavatar.io/x/${cleanUsername}`);
      if (!res.ok) throw new Error("Invalid username");

      const user = {
        username: cleanUsername,
        avatar: `https://unavatar.io/x/${cleanUsername}`,
      };

      navigate("/start", { state: { user } });
    } catch {
      setError("Invalid X username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-accent to-primary px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-accent mb-6 leading-tight">
          Concero × Lanca Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Avatar preview */}
          {username && (
            <motion.div
              key={username}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <img
                src={`https://unavatar.io/x/${username.replace("@", "")}`}
                alt="profile preview"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-accent shadow-md mb-2"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <p className="text-gray-600 text-sm sm:text-base">
                @{username.replace("@", "")}
              </p>
            </motion.div>
          )}

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login with X"}
          </button>
        </form>
      </motion.div>

      {/* Signature footer */}
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
