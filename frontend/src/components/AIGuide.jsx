import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export function AIGuide() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your AI math assistant. I can help you with calculations or explain concepts. Try calculating something!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/ask-ai', {
                prompt: input,
                context: "User is using the calculator."
            });

            setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't connect to the server. Is the backend running?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md h-[600px] bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gray-800/50 flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-full">
                    <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-400">Always here to help</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-blue-600/20' : 'bg-purple-600/20'}`}>
                                {msg.role === 'ai' ? <Bot size={16} className="text-blue-400" /> : <User size={16} className="text-purple-400" />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'ai'
                                ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                                : 'bg-purple-600 text-white rounded-tr-none'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-800/30">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <Button
                        variant="primary"
                        className="w-12 h-12 rounded-xl !p-0 flex items-center justify-center"
                        onClick={handleSend}
                    >
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
