import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, onClick, className, variant = 'default', ...props }) {
    const baseStyles = "relative flex items-center justify-center rounded-2xl text-xl font-medium transition-all duration-100 active:scale-90 active:brightness-125 active:ring-2 active:ring-white/50 hover:brightness-110 select-none";

    const variants = {
        default: "bg-gray-800 text-white shadow-lg shadow-gray-900/50",
        primary: "bg-blue-600 text-white shadow-lg shadow-blue-900/50",
        accent: "bg-orange-500 text-white shadow-lg shadow-orange-900/50",
        secondary: "bg-gray-700 text-gray-200 shadow-lg shadow-gray-900/50",
        ghost: "bg-transparent text-gray-400 hover:bg-gray-800/50",
    };

    return (
        <button
            onClick={onClick}
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
