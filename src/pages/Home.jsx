import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Lenis from "lenis";
import AnimatedBackground from "../components/AnimatedBackground";
import ConceroLogo from "../assets/concero-logo.png";
import LancaLogo from "../assets/lanca-logo.png";
import ConceroDashboard from "../assets/concero-dashboard.png";
import LancaDashboard from "../assets/lanca-dashboard.png";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
    const navigate = useNavigate();
    const conceroRef = useRef(null);
    const lancaRef = useRef(null);
    const quizRef = useRef(null);

    const conceroInView = useInView(conceroRef, { margin: "-100px" });
    const lancaInView = useInView(lancaRef, { margin: "-100px" });
    const quizInView = useInView(quizRef, { margin: "-100px" });

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="relative bg-[#ffd7b5] dark:bg-gray-900 overflow-x-hidden overflow-y-hidden font-sans text-gray-800 dark:text-gray-100 transition-colors duration-500">
            <AnimatedBackground />

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center h-screen px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center gap-6 mb-8"
                >
                    <img src={ConceroLogo} alt="Concero" className="h-16 sm:h-20 object-contain drop-shadow-md" />
                    <span className="text-2xl text-gray-400 dark:text-gray-500 font-light">×</span>
                    <img src={LancaLogo} alt="Lanca" className="h-16 sm:h-20 object-contain drop-shadow-md rounded-xl" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-4xl sm:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#fe7f2d] to-[#fcca46] drop-shadow-sm"
                >
                    Concero × Lanca Quiz
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12 font-medium"
                >
                    Test your knowledge, climb the leaderboard, and compete in exclusive tournaments.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-16"
                >
                    <button
                        onClick={() => navigate("/login")}
                        className="flex-1 bg-gradient-to-r from-[#fe7f2d] to-[#fcca46] text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg animate-bounce"
                    >
                        Get Started
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{
                        opacity: { delay: 1, duration: 1 },
                        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    }}
                    className="cursor-pointer"
                    onClick={() => scrollToSection(conceroRef)}
                >
                    <svg
                        className="w-8 h-8 text-[#fe7f2d]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-6 text-sm text-gray-500 dark:text-gray-400 font-medium"
                >
                    Made with ❤️ by <a href="https://x.com/adedir2" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] hover:underline">@adedir2</a>
                </motion.p>
            </section>

            {/* Concero Section - More gap, smaller image */}
            <section ref={conceroRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-0">
                <div className="max-w-6xl w-full flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -200 }}
                        animate={conceroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -200 }}
                        transition={{ duration: 1, delay: 0 }}
                        className="mb-8 md:mb-0 relative z-20"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <img src={ConceroLogo} alt="Concero" className="h-12 object-contain" />
                            <h2 className="text-5xl font-black text-gray-800 dark:text-white">Concero</h2>
                        </div>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl">
                            A decentralized cross-chain interoperability protocol designed to facilitate seamless communication across blockchains.
                            Concero offers a quicker, safer, and easier-to-use cross-chain infrastructure that is scalable, secure, capital efficient,
                            and decentralized for both bridging and messaging.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://concero.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                            >
                                Learn More <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden w-full max-w-xl ml-auto md:-mt-16 relative z-10"
                        initial={{ opacity: 0, y: 300 }}
                        animate={conceroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 300 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <img
                            src={ConceroDashboard}
                            alt="Concero Dashboard"
                            className="w-full h-auto"
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={conceroInView ? { opacity: 1, y: [0, 10, 0] } : { opacity: 0 }}
                    transition={{
                        opacity: { delay: 1, duration: 1 },
                        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    }}
                    className="cursor-pointer absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
                    onClick={() => scrollToSection(lancaRef)}
                >
                    <svg
                        className="w-8 h-8 text-[#fe7f2d]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </section>

            {/* Lanca Section - More gap, smaller image */}
            <section ref={lancaRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-0">
                <div className="max-w-6xl w-full flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -200 }}
                        animate={lancaInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -200 }}
                        transition={{ duration: 1, delay: 0 }}
                        className="mb-8 md:mb-0 relative z-20"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <img src={LancaLogo} alt="Lanca" className="h-12 object-contain" />
                            <h2 className="text-5xl font-black text-gray-800 dark:text-white">Lanca</h2>
                        </div>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl">
                            A cross-chain bridging protocol powered by Concero Messaging and secured by Chainlink CCIP. Lanca makes
                            cross-chain transfers effortless, providing a seamless decentralized exchange experience across multiple blockchains
                            with fast, secure, and reliable transactions.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://lanca.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                            >
                                Learn More <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden w-full max-w-xl ml-auto md:-mt-16 relative z-10"
                        initial={{ opacity: 0, y: 300 }}
                        animate={lancaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 300 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <img
                            src={LancaDashboard}
                            alt="Lanca Dashboard"
                            className="w-full h-auto"
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={lancaInView ? { opacity: 1, y: [0, 10, 0] } : { opacity: 0 }}
                    transition={{
                        opacity: { delay: 1, duration: 1 },
                        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    }}
                    className="cursor-pointer absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
                    onClick={() => scrollToSection(quizRef)}
                >
                    <svg
                        className="w-8 h-8 text-[#fe7f2d]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </section>

            {/* Quiz Intro Section */}
            <section ref={quizRef} className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={quizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl w-full text-center"
                >
                    <h2 className="text-5xl font-black text-gray-800 dark:text-white mb-8">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={quizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                className="text-5xl mb-4 inline-block"
                            >
                                📝
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Take the Quiz</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Answer questions about Concero and Lanca to test your knowledge of cross-chain technology.
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -10 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={quizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-5xl mb-4 inline-block"
                            >
                                📊
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Climb the Ranks</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Your score is calculated and added to the leaderboard. Compete daily, weekly, or all-time!
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={quizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="text-5xl mb-4 inline-block"
                            >
                                🏆
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Win Tournaments</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Participate in exclusive tournaments for a chance to win prizes and recognition!
                            </p>
                        </motion.div>
                    </div>
                    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md mx-auto">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-gradient-to-r from-[#fe7f2d] to-[#fcca46] text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xl animate-bounce"
                        >
                            Start Quiz Now →
                        </button>
                        <button
                            onClick={() => navigate("/leaderboard")}
                            className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-[#fe7f2d] font-bold py-4 px-8 rounded-2xl shadow-md hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 text-lg border-2 border-[#fe7f2d]/20"
                        >
                            View Leaderboard
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
