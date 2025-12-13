import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel", isAlert = false }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-white/20 dark:border-gray-700/50 overflow-hidden"
                    >
                        {/* Glossy Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">
                            {title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
                            {message}
                        </p>

                        <div className="flex justify-end gap-3 relative z-10">
                            {!isAlert && (
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className={`px-6 py-2 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 ${isAlert
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/30"
                                        : "bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-red-500/30"
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
