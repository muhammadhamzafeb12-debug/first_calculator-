import React from 'react';
import { motion } from 'framer-motion';

export function Display({ value, expression, angleMode, hasMemory }) {
    return (
        <div className="w-full bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 mb-6 shadow-inner shadow-black/50 border border-gray-800">
            {/* Indicators Row */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex gap-3">
                    {hasMemory && (
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/20 px-2 py-1 rounded">
                            M
                        </span>
                    )}
                </div>
                <span className="text-xs font-bold text-purple-400 bg-purple-400/20 px-2 py-1 rounded">
                    {angleMode}
                </span>
            </div>

            <div className="flex flex-col items-end justify-end h-32 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-400 text-lg font-mono mb-2 h-6"
                >
                    {expression}
                </motion.div>
                <motion.div
                    key={value}
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold text-white tracking-tight break-all text-right w-full"
                >
                    {value || '0'}
                </motion.div>
            </div>
        </div>
    );
}
