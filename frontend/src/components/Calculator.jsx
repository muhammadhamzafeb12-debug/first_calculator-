import React, { useState } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';

export function Calculator() {
    const [displayValue, setDisplayValue] = useState('');
    const [expression, setExpression] = useState('');
    const [memory, setMemory] = useState(0);
    const [angleMode, setAngleMode] = useState('DEG'); // 'DEG' or 'RAD'

    // Helper function to calculate factorial
    const factorial = (n) => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };

    // Helper function to convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    // Helper function to convert radians to degrees
    const toDegrees = (radians) => radians * (180 / Math.PI);

    // Sound effect function
    const playClickSound = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.error("AudioContext error:", e);
        }
    };

    // Text-to-speech function
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    const getSpokenText = (btn) => {
        if (btn.label === 'C') return 'Clear';
        if (btn.label === '⌫') return 'Backspace';
        if (btn.label === '=') return 'Equals';
        if (btn.label === '.') return 'Point';
        if (btn.label === '+') return 'Plus';
        if (btn.label === '-') return 'Minus';
        if (btn.label === '×') return 'Multiply';
        if (btn.label === '÷') return 'Divide';
        if (btn.label === '^') return 'Power';
        if (btn.label === '√') return 'Square Root';
        if (btn.label === 'x!') return 'Factorial';
        if (btn.label === '%') return 'Percent';
        if (btn.label === 'sin') return 'Sine';
        if (btn.label === 'cos') return 'Cosine';
        if (btn.label === 'tan') return 'Tangent';
        if (btn.label === 'ln') return 'Natural Log';
        if (btn.label === 'log') return 'Log';
        return btn.label;
    };

    const handleButtonClick = (btn) => {
        playClickSound();
        speak(getSpokenText(btn));

        switch (btn.action) {
            case 'number':
            case 'decimal':
                setDisplayValue(prev => prev + btn.value);
                break;
            case 'operator':
                // If displayValue is not empty, append it to expression
                if (displayValue) {
                    setExpression(prev => prev + displayValue + btn.value);
                    setDisplayValue('');
                } else {
                    // If expression ends with operator, replace it? Or just append (e.g. negative)
                    setExpression(prev => prev + btn.value);
                }
                break;
            case 'func':
                setExpression(prev => prev + btn.value);
                break;
            case 'constant':
                setDisplayValue(prev => prev + btn.value);
                break;
            case 'clear':
                setDisplayValue('');
                setExpression('');
                break;
            case 'backspace':
                setDisplayValue(prev => prev.slice(0, -1));
                break;
            case 'factorial':
                try {
                    const num = parseFloat(displayValue || expression);
                    const result = factorial(Math.floor(num));
                    setDisplayValue(String(result));
                    setExpression('');
                } catch (e) {
                    setDisplayValue('Error');
                    setExpression('');
                }
                break;
            case 'percentage':
                try {
                    const num = parseFloat(displayValue || expression);
                    setDisplayValue(String(num / 100));
                    setExpression('');
                } catch (e) {
                    setDisplayValue('Error');
                }
                break;
            case 'toggleAngle':
                setAngleMode(prev => prev === 'DEG' ? 'RAD' : 'DEG');
                break;
            case 'memoryAdd':
                setMemory(prev => prev + parseFloat(displayValue || 0));
                break;
            case 'memorySubtract':
                setMemory(prev => prev - parseFloat(displayValue || 0));
                break;
            case 'memoryRecall':
                setDisplayValue(String(memory));
                setExpression('');
                break;
            case 'memoryClear':
                setMemory(0);
                break;
            case 'calculate':
                try {
                    // Combine expression and current display value
                    let finalExpr = expression + displayValue;

                    // Handle angle conversions for trig functions if in DEG mode
                    if (angleMode === 'DEG') {
                        finalExpr = finalExpr
                            .replace(/Math\.sin\(/g, 'Math.sin(toRadians(')
                            .replace(/Math\.cos\(/g, 'Math.cos(toRadians(')
                            .replace(/Math\.tan\(/g, 'Math.tan(toRadians(')
                            .replace(/Math\.asin\(/g, 'toDegrees(Math.asin(')
                            .replace(/Math\.acos\(/g, 'toDegrees(Math.acos(')
                            .replace(/Math\.atan\(/g, 'toDegrees(Math.atan(');

                        // Add extra closing parenthesis for inverse trig functions
                        const asinCount = (finalExpr.match(/toDegrees\(Math\.asin\(/g) || []).length;
                        const acosCount = (finalExpr.match(/toDegrees\(Math\.acos\(/g) || []).length;
                        const atanCount = (finalExpr.match(/toDegrees\(Math\.atan\(/g) || []).length;

                        // Count and balance parentheses
                        for (let i = 0; i < asinCount + acosCount + atanCount; i++) {
                            if (!finalExpr.endsWith(')')) {
                                finalExpr += ')';
                            }
                        }
                    }

                    // Basic sanitization/evaluation
                    // eslint-disable-next-line no-eval
                    const result = eval(finalExpr);
                    setDisplayValue(String(result));
                    setExpression('');
                } catch (e) {
                    setDisplayValue('Error');
                    setExpression('');
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl">
            <Display
                value={displayValue}
                expression={expression}
                angleMode={angleMode}
                hasMemory={memory !== 0}
            />
            <Keypad onButtonClick={handleButtonClick} angleMode={angleMode} />
        </div>
    );
}
