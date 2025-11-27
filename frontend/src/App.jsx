import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { AIGuide } from './components/AIGuide';
import { SideGame } from './components/SideGame';
import { Gamepad2 } from 'lucide-react';
import { Button } from './components/Button';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'game'

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8 relative">

      <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg">
        AI Calculator
      </h1>

      <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full max-w-7xl">
        {/* Left Column: Calculator */}
        <div className="flex-1 w-full flex justify-center xl:justify-end">
          <Calculator />
        </div>

        {/* Right Column: AI Guide or Game */}
        <div className="flex-1 w-full flex flex-col items-center xl:items-start gap-4">
          {/* Tab Switcher */}
          <div className="bg-gray-800/50 p-1 rounded-xl flex gap-1 border border-gray-700">
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'game'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <Gamepad2 size={16} />
              Neon Racer
            </button>
          </div>

          {/* Content Area */}
          <div className="w-full flex justify-center xl:justify-start">
            <AnimatePresence mode="wait">
              {activeTab === 'ai' ? (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md"
                >
                  <AIGuide />
                </motion.div>
              ) : (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-md"
                >
                  <SideGame onClose={() => setActiveTab('ai')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

