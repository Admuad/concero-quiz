import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-4 w-16 sm:w-20 h-20 sm:h-24 flex items-center justify-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="text-2xl sm:text-4xl font-black text-white z-10"
                >
                    {value.toString().padStart(2, "0")}
                </motion.span>
            </AnimatePresence>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest mt-2">
            {label}
        </span>
    </div>
);

export default function Countdown({ targetDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const difference = new Date(targetDate) - new Date();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (
                newTimeLeft.days === 0 &&
                newTimeLeft.hours === 0 &&
                newTimeLeft.minutes === 0 &&
                newTimeLeft.seconds === 0
            ) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex justify-center items-center py-6">
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="text-2xl sm:text-4xl font-bold text-white/50 -mt-6">:</span>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <span className="text-2xl sm:text-4xl font-bold text-white/50 -mt-6">:</span>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl sm:text-4xl font-bold text-white/50 -mt-6">:</span>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
    );
}
