import React from 'react';
import { CompilerData } from '@/types';
import { motion } from 'framer-motion';

export const IRView = ({ ir }: { ir: CompilerData['ir'] }) => {
  return (
    <div className="w-full h-full p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-400">Intermediate Representation</h2>
      <p className="mb-6 text-gray-300">
        Generates 3-address code, a low-level representation independent of the target machine.
      </p>
      
      <div className="border-2 border-[#ef4444] bg-[#7f1d1d]/40 p-6 rounded-xl font-mono text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        {ir && ir.length > 0 ? (
          <div className="space-y-2">
            {ir.map((instr, i) => {
              let display = '';
              const { op, arg1, arg2, result } = instr;
              
              if (op === '=') display = `${result} = ${arg1}`;
              else if (['+', '-', '*', '/', '==', '!=', '<', '>', '<=', '>=', '&&', '||'].includes(op)) {
                display = `${result} = ${arg1} ${op} ${arg2}`;
              } else if (op === 'if_false') display = `if false ${arg1} goto ${result}`;
              else if (op === 'goto') display = `goto ${result}`;
              else if (op === 'label') display = `${result}:`;
              else if (op === 'print') display = `print ${arg1}`;
              else if (op === 'return') display = `return ${arg1}`;
              else if (op === 'ERROR') display = `ERROR: ${arg1}`;
              else display = `${op} ${arg1} ${arg2} ${result}`;

              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className={`py-2 px-4 rounded-md flex items-center hover:bg-[#991b1b]/50 transition-colors cursor-pointer ${
                    op === 'label' ? 'bg-[#991b1b]/80 font-bold text-red-200 mt-4' : 'bg-[#991b1b]/30 text-red-100 ml-4'
                  } ${op === 'ERROR' ? 'bg-red-900/40 text-red-400' : ''}`}
                >
                  <span className="w-8 text-red-300/50 text-xs select-none">{i + 1}</span>
                  <span>{display}</span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-slate-500 italic text-center py-8">
            No intermediate code generated.
          </div>
        )}
      </div>
    </div>
  );
};
