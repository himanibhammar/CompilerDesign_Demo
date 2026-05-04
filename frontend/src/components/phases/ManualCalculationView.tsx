import React from 'react';
import { motion } from 'framer-motion';

export const ManualCalculationView = () => {
  return (
    <div className="w-full h-full p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400">Manual Calculation</h2>
      <p className="mb-6 text-gray-300 border-b border-slate-700 pb-4">
        (It verifies the correctness of the Program Logic.)
      </p>

      <div className="space-y-8">
        {/* Case 1: ch = 'A' */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-xl border border-indigo-500/30"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">
            I. Given input: <span className="text-blue-400 font-mono">ch = 'A'</span>
          </h3>
          <p className="text-slate-400 text-sm mb-4 italic">* Step-by-Step Execution</p>
          
          <div className="space-y-4 ml-2">
            <div>
              <h4 className="font-semibold text-emerald-400 mb-2">① Check Alphabet Condition</h4>
              <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-sm space-y-2 border border-slate-700">
                <p>Is ch {'>'}= 'a' && ch {'<'}= 'z' ?</p>
                <p className="text-slate-400 ml-4">{'\'A\''} {'>'}= 'a' <span className="text-red-400 font-bold ml-2">→ FALSE</span></p>
                
                <p className="mt-4">Is ch {'>'}= 'A' && ch {'<'}= 'Z' ?</p>
                <p className="text-slate-400 ml-4">{'\'A\''} {'>'}= 'A' <span className="text-emerald-400 font-bold ml-2">→ TRUE</span></p>
                <p className="text-slate-400 ml-4">{'\'A\''} {'<'}= 'Z' <span className="text-emerald-400 font-bold ml-2">→ TRUE</span></p>
                
                <p className="text-emerald-300 font-bold mt-2">→ Condition TRUE</p>
                <p className="text-slate-300 mt-1">∴ Program enters alphabet block.</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-emerald-400 mb-2">② Check Vowel Condition</h4>
              <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-sm space-y-2 border border-slate-700">
                <p>ch == 'A' <span className="text-emerald-400 font-bold ml-2">→ TRUE</span></p>
                <p className="text-slate-300 mt-2">∴ Output = "Vowel"</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/50 rounded-lg">
              <span className="font-bold text-indigo-300">FINAL OUTPUT: </span>
              <span className="text-white">Vowel</span>
            </div>
          </div>
        </motion.div>

        {/* Case 2: ch = '5' */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-xl border border-indigo-500/30"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">
            II. Given input: <span className="text-blue-400 font-mono">ch = '5'</span>
          </h3>
          
          <div className="space-y-4 ml-2">
            <h4 className="font-semibold text-emerald-400 mb-2">• Checking Conditions:</h4>
            <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-sm space-y-2 border border-slate-700">
              <p className="text-slate-400">Not alphabet</p>
              <p>Check digit:</p>
              <p className="ml-4">{'\'5\''} {'>'}= '0' AND {'\'5\''} {'<'}= '9' <span className="text-emerald-400 font-bold ml-2">→ TRUE</span></p>
            </div>

            <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/50 rounded-lg">
              <span className="font-bold text-indigo-300">FINAL OUTPUT: </span>
              <span className="text-white">"Digit"</span>
            </div>
          </div>
        </motion.div>

        {/* Case 3: ch = '#' */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-xl border border-indigo-500/30"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">
            III. Given input: <span className="text-blue-400 font-mono">ch = '#'</span>
          </h3>
          
          <div className="space-y-4 ml-2">
            <h4 className="font-semibold text-emerald-400 mb-2">• Checking Conditions:</h4>
            <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-sm space-y-2 border border-slate-700">
              <p className="text-slate-400">Not alphabet</p>
              <p className="text-slate-400">Not digit</p>
            </div>

            <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/50 rounded-lg">
              <span className="font-bold text-indigo-300">FINAL OUTPUT: </span>
              <span className="text-white">"Special Character"</span>
            </div>
          </div>
        </motion.div>
        
        {/* The 1st Photo as requested at the very end */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-slate-700 flex flex-col items-center justify-center"
        >
          <h3 className="text-2xl font-bold text-amber-400 mb-6">Original Poster Reference</h3>
          <div className="max-w-4xl w-full p-2 bg-slate-800 rounded-xl border border-slate-600 shadow-2xl">
            {/* The user should drop the chart image in the public folder as 'chart.jpg' */}
            <img 
              src="/chart.jpg" 
              alt="Six Phases of Compiler Demonstration Chart" 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://via.placeholder.com/1200x800.png?text=Please+place+your+1st+photo+in+public/chart.jpg";
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
