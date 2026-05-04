"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { PhaseStepper } from '@/components/PhaseStepper';
import { Phase, CompilerData } from '@/types';
import { compileCode } from '@/lib/api';
import { Play, Loader2, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Phase Views
import { LexicalView } from '@/components/phases/LexicalView';
import { SyntaxView } from '@/components/phases/SyntaxView';
import { SemanticView } from '@/components/phases/SemanticView';
import { IRView } from '@/components/phases/IRView';
import { OptimizationView } from '@/components/phases/OptimizationView';
import { CodeGenView } from '@/components/phases/CodeGenView';
import { ManualCalculationView } from '@/components/phases/ManualCalculationView';

const DEFAULT_CODE = `int a = 10;
int b = 5;
int c = a + b;
print(c);

if (c > 10) {
  a = a * 2;
} else {
  a = a / 2;
}
`;

const PHASES: Phase[] = ['input', 'lexical', 'syntax', 'semantic', 'ir', 'optimization', 'codegen', 'calculation'];

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [phase, setPhase] = useState<Phase>('input');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilerData, setCompilerData] = useState<CompilerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompile = async () => {
    setIsCompiling(true);
    setError(null);
    try {
      const data = await compileCode(code);
      setCompilerData(data);
      // Automatically move to lexical phase to show results
      setPhase('lexical');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compilation failed');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleNextPhase = () => {
    const currentIndex = PHASES.indexOf(phase);
    if (currentIndex < PHASES.length - 1) {
      setPhase(PHASES[currentIndex + 1]);
    }
  };

  const handlePrevPhase = () => {
    const currentIndex = PHASES.indexOf(phase);
    if (currentIndex > 0) {
      setPhase(PHASES[currentIndex - 1]);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
          Compiler Phase Visualizer
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Write C-like code and see how a compiler translates it step-by-step from raw text to machine assembly.
        </p>
      </header>

      <PhaseStepper 
        currentPhase={phase} 
        setPhase={setPhase} 
        completedPhases={compilerData !== null} 
      />

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[600px] mt-4">
        {/* Left Side: Code Editor (always visible or collapsable, let's keep it visible but resize based on phase) */}
        <div className={`flex flex-col rounded-xl overflow-hidden glass border ${phase === 'input' ? 'w-full' : 'w-full md:w-1/3'}`}>
          <div className="bg-slate-800/80 p-3 flex justify-between items-center border-b border-slate-700">
            <span className="font-semibold text-slate-200">Source Code</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCode(DEFAULT_CODE)}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Reset Code"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isCompiling ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                Run Simulation
              </button>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="c"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        {/* Right Side: Visualizer Panel */}
        {phase !== 'input' && (
          <div className="w-full md:w-2/3 glass rounded-xl overflow-hidden flex flex-col relative border border-slate-700">
            {error ? (
              <div className="p-8 flex items-center justify-center h-full text-red-400">
                <div className="bg-red-950/50 p-6 rounded-lg border border-red-500/30 text-center">
                  <h3 className="text-xl font-bold mb-2">Simulation Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            ) : !compilerData ? (
              <div className="p-8 flex items-center justify-center h-full text-slate-400 flex-col gap-4">
                <Play size={48} className="opacity-20" />
                <p>Click "Run Simulation" to generate visualizer data.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {phase === 'lexical' && <LexicalView tokens={compilerData.tokens} />}
                    {phase === 'syntax' && <SyntaxView parseTree={compilerData.parse_tree} />}
                    {phase === 'semantic' && <SemanticView semantic={compilerData.semantic} />}
                    {phase === 'ir' && <IRView ir={compilerData.ir} />}
                    {phase === 'optimization' && <OptimizationView ir={compilerData.ir} optimized={compilerData.optimized} />}
                    {phase === 'codegen' && <CodeGenView target={compilerData.target} />}
                    {phase === 'calculation' && <ManualCalculationView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            
            {/* Navigation Controls */}
            {compilerData && !error && (
              <div className="bg-slate-800/80 p-4 border-t border-slate-700 flex justify-between items-center z-10">
                <button
                  onClick={handlePrevPhase}
                  disabled={phase === 'lexical'}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Phase
                </button>
                <div className="text-sm text-slate-400">
                  Step {PHASES.indexOf(phase)} of {PHASES.length - 1}
                </div>
                <button
                  onClick={handleNextPhase}
                  disabled={phase === 'calculation'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Phase
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
