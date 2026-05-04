import React from 'react';
import { CompilerData } from '@/types';
import { motion } from 'framer-motion';

export const CodeGenView = ({ target }: { target: CompilerData['target'] }) => {
  return (
    <div className="w-full h-full p-4 overflow-auto flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-[#22c55e]">Target Code Generation</h2>
      <p className="mb-6 text-gray-300">
        Translates the optimized intermediate representation into machine-specific pseudo-assembly code.
      </p>
      
      <div className="flex-1 border-2 border-[#16a34a] bg-[#14532d]/20 rounded-xl overflow-hidden flex flex-col font-mono shadow-[0_0_15px_rgba(22,163,74,0.15)]">
        <div className="bg-[#14532d]/40 p-2 flex border-b border-[#16a34a]/30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
          </div>
          <div className="mx-auto text-xs font-bold text-[#86efac]">assembly.asm</div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto text-sm">
          {target && target.length > 0 ? (
            <div className="space-y-1">
              {target.map((t, i) => {
                const instr = t.instruction;
                const isLabel = instr.endsWith(':');
                const isCommand = !isLabel;
                
                const parts = instr.split(' ');
                const op = parts[0];
                const rest = parts.slice(1).join(' ');

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={i} 
                    className="flex items-start"
                  >
                    <span className="w-8 shrink-0 text-[#86efac]/50 select-none text-right pr-4 mt-0.5">{i + 1}</span>
                    {isLabel ? (
                      <span className="text-[#fde047] font-bold">{instr}</span>
                    ) : instr.startsWith(';') ? (
                      <span className="text-gray-400 italic whitespace-pre ml-4">{instr}</span>
                    ) : (
                      <div className="ml-4">
                        <span className="text-[#86efac] font-bold w-12 inline-block">{op}</span>
                        <span className="text-white">{rest}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-[#858585] italic h-full flex items-center justify-center">
              No assembly code generated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
