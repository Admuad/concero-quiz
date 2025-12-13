import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 dark:from-indigo-600 dark:to-purple-600 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {/* Track Background Animation */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        initial={false}
        animate={{
          background: isDark
            ? 'linear-gradient(to right, #4f46e5, #7c3aed)'
            : 'linear-gradient(to right, #fb923c, #fde047)'
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Clouds for light mode */}
        <motion.div
          className="absolute top-1 left-2 w-4 h-2 bg-white/30 rounded-full blur-[1px]"
          animate={{ x: isDark ? -20 : 0, opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1 left-5 w-5 h-2 bg-white/20 rounded-full blur-[1px]"
          animate={{ x: isDark ? -20 : 0, opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Stars for dark mode */}
        <motion.div
          className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full shadow-[0_0_2px_#fff]"
          animate={{ scale: isDark ? [1, 1.5, 1] : 0, opacity: isDark ? 1 : 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-2 right-5 w-0.5 h-0.5 bg-white rounded-full"
          animate={{ scale: isDark ? [1, 1.5, 1] : 0, opacity: isDark ? 1 : 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute top-1 right-6 w-0.5 h-0.5 bg-white rounded-full"
          animate={{ scale: isDark ? [1, 1.5, 1] : 0, opacity: isDark ? 1 : 0 }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        />
      </motion.div>

      {/* Thumb */}
      <motion.div
        className="absolute top-0.5 left-0.5 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center z-10"
        animate={{
          x: isDark ? 32 : 0,
          rotate: isDark ? 360 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        {/* Icon Container */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={{ rotate: isDark ? -360 : 0 }} // Counter-rotate to keep icon upright if desired, or let it spin
          transition={{ duration: 0.5 }}
        >
          {/* Sun Icon */}
          <motion.svg
            className="absolute w-4 h-4 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={{
              scale: isDark ? 0 : 1,
              opacity: isDark ? 0 : 1,
              rotate: isDark ? 90 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </motion.svg>

          {/* Moon Icon */}
          <motion.svg
            className="absolute w-4 h-4 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            animate={{
              scale: isDark ? 1 : 0,
              opacity: isDark ? 1 : 0,
              rotate: isDark ? 0 : -90
            }}
            transition={{ duration: 0.3 }}
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </button>
  );
}
