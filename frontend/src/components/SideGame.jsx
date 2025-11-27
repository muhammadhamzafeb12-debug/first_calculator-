





import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { X, Trophy, Play, ArrowLeft, ArrowRight } from 'lucide-react';

export function SideGame({ onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [playerLane, setPlayerLane] = useState(1); // 0: Left, 1: Center, 2: Right
    const [obstacles, setObstacles] = useState([]);
    const gameLoopRef = useRef();
    const speedRef = useRef(5);
    const scoreRef = useRef(0);

    // Sound generation helper
    const playSound = (type) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            switch (type) {
                case 'move':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(300, now);
                    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;
                case 'score':
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(800, now);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;
                case 'gameover':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(200, now);
                    oscillator.frequency.linearRampToValueAtTime(50, now + 0.5);
                    gainNode.gain.setValueAtTime(0.2, now);
                    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.5);
                    oscillator.start(now);
                    oscillator.stop(now + 0.5);
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        scoreRef.current = 0;
        setGameOver(false);
        setPlayerLane(1);
        setObstacles([]);
        speedRef.current = 5;
    };

    const moveLeft = () => {
        if (playerLane > 0) {
            setPlayerLane(prev => prev - 1);
            playSound('move');
        }
    };

    const moveRight = () => {
        if (playerLane < 2) {
            setPlayerLane(prev => prev + 1);
            playSound('move');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying) return;
            if (e.key === 'ArrowLeft') moveLeft();
            if (e.key === 'ArrowRight') moveRight();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, playerLane]);

    useEffect(() => {
        if (!isPlaying) return;

        const loop = () => {
            setObstacles(prev => {
                // Move existing obstacles
                const moved = prev.map(obs => ({ ...obs, y: obs.y + speedRef.current }));

                // Remove off-screen obstacles and increment score
                const kept = moved.filter(obs => {
                    if (obs.y > 600) {
                        setScore(s => {
                            scoreRef.current = s + 1;
                            if (scoreRef.current % 5 === 0) playSound('score');
                            return s + 1;
                        });
                        // Increase speed slightly every 10 points
                        if (scoreRef.current % 10 === 0) speedRef.current += 0.5;
                        return false;
                    }
                    return true;
                });

                // Spawn new obstacles
                if (Math.random() < 0.02 + (scoreRef.current * 0.001)) {
                    const lane = Math.floor(Math.random() * 3);
                    // Don't spawn on top of another obstacle
                    const tooClose = kept.some(obs => obs.y < 100 && obs.lane === lane);
                    if (!tooClose) {
                        kept.push({ lane, y: -50, id: Date.now() });
                    }
                }

                // Collision detection
                const playerY = 500; // Fixed player Y position
                const collision = kept.some(obs =>
                    obs.lane === playerLane &&
                    obs.y > playerY - 40 &&
                    obs.y < playerY + 40
                );

                if (collision) {
                    setGameOver(true);
                    setIsPlaying(false);
                    playSound('gameover');
                }

                return kept;
            });

            if (!gameOver) {
                gameLoopRef.current = requestAnimationFrame(loop);
            }
        };

        gameLoopRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [isPlaying, playerLane, gameOver]);

    return (
        <div className="w-full max-w-md h-[600px] bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-4 border-b border-gray-800 bg-gray-800/50 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Neon Racer
                    </h2>
                    <p className="text-gray-400 text-xs">Dodge the obstacles!</p>
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded-full text-green-400 font-mono text-sm border border-gray-700">
                    Score: {score}
                </div>
            </div>

            {/* Game Area */}
            <div className="relative flex-1 bg-gray-800 overflow-hidden">
                {/* Road Markings */}
                <div className="absolute inset-0 flex justify-between px-16">
                    <div className="w-1 h-full bg-dashed border-l border-dashed border-gray-600 opacity-50"></div>
                    <div className="w-1 h-full bg-dashed border-l border-dashed border-gray-600 opacity-50"></div>
                </div>

                {/* Player Car */}
                {isPlaying && (
                    <motion.div
                        className="absolute bottom-10 w-12 h-20 bg-blue-500 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.8)] flex items-center justify-center z-10"
                        animate={{ left: playerLane * 85 + 40 }} // Adjusted for container width
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="w-8 h-16 border-2 border-blue-300 rounded bg-blue-600/50"></div>
                    </motion.div>
                )}

                {/* Obstacles */}
                {obstacles.map(obs => (
                    <div
                        key={obs.id}
                        className="absolute w-12 h-12 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center z-10"
                        style={{
                            left: obs.lane * 85 + 40,
                            top: obs.y
                        }}
                    >
                        <div className="text-2xl">🪨</div>
                    </div>
                ))}

                {/* Start Screen */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <Button variant="primary" onClick={startGame} className="px-8 py-4 text-xl gap-2 animate-pulse">
                            <Play size={24} /> Start Race
                        </Button>
                    </div>
                )}

                {/* Game Over Screen */}
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                        <Trophy size={64} className="text-yellow-400 mb-4" />
                        <div className="text-3xl font-bold text-white mb-2">Crashed!</div>
                        <div className="text-xl text-gray-300 mb-6">Score: {score}</div>
                        <Button variant="primary" onClick={startGame} className="px-6 py-3">
                            Try Again
                        </Button>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex justify-center gap-8">
                <Button variant="secondary" onClick={moveLeft} className="w-16 h-16 rounded-full">
                    <ArrowLeft size={28} />
                </Button>
                <Button variant="secondary" onClick={moveRight} className="w-16 h-16 rounded-full">
                    <ArrowRight size={28} />
                </Button>
            </div>
        </div>
    );
}
