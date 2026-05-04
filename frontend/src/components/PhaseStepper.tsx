import React from 'react';
import { Phase } from '@/types';
import { Check, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PHASES: { id: Phase; label: string; color: string }[] = [
  { id: 'input', label: 'Source', color: 'bg-slate-500' },
  { id: 'lexical', label: 'Lexical', color: 'bg-blue-500' },
  { id: 'syntax', label: 'Syntax', color: 'bg-emerald-500' },
  { id: 'semantic', label: 'Semantic', color: 'bg-purple-500' },
  { id: 'ir', label: 'IR Gen', color: 'bg-orange-500' },
  { id: 'optimization', label: 'Optimize', color: 'bg-pink-500' },
  { id: 'codegen', label: 'CodeGen', color: 'bg-cyan-500' },
  { id: 'calculation', label: 'Manual Calc', color: 'bg-indigo-500' },
];

export const PhaseStepper = ({ 
  currentPhase, 
  setPhase,
  completedPhases
}: { 
  currentPhase: Phase; 
  setPhase: (phase: Phase) => void;
  completedPhases: boolean;
}) => {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="w-full flex items-center justify-between p-4 glass-panel rounded-xl mb-4 overflow-x-auto">
      {PHASES.map((phase, index) => {
        const isActive = currentPhase === phase.id;
        const isPast = index < currentIndex;
        // If compilation is done, all but the current can be clickable. But let's say all are clickable once generated.
        const isClickable = completedPhases || index === 0;

        return (
          <React.Fragment key={phase.id}>
            <div 
              className={`flex items-center gap-2 flex-col sm:flex-row cursor-pointer transition-all ${
                isActive ? 'scale-105' : isClickable ? 'opacity-80 hover:opacity-100' : 'opacity-40 cursor-not-allowed'
              }`}
              onClick={() => isClickable && setPhase(phase.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                isActive ? phase.color : isPast ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {isPast ? <Check size={16} /> : index + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {phase.label}
              </span>
            </div>
            
            {index < PHASES.length - 1 && (
              <div className="hidden sm:block text-slate-600">
                <ChevronRight size={20} />
              </div>
            )}
            {isActive && (
              <motion.div 
                layoutId="activeIndicator"
                className={`absolute bottom-2 h-1 rounded-full ${phase.color.replace('bg-', 'bg-')}`} 
                initial={false}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
