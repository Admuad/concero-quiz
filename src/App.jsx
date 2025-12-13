// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Start from "./pages/Start";
import Quiz from "./pages/Quiz";
import Tournament from "./pages/Tournament";
import TournamentStart from "./pages/TournamentStart";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/start" element={<Start />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/tournament-start" element={<TournamentStart />} />
            <Route path="/result" element={<Result />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>


      </div>
    </Router>
  );
}
