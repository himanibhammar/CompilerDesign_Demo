import React from 'react';
import { CompilerData } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const OptimizationView = ({ ir, optimized }: { ir: CompilerData['ir'], optimized: CompilerData['optimized'] }) => {
  const renderIR = (code: CompilerData['ir']) => {
    if (!code || code.length === 0) return <div className="text-slate-500 italic p-4">Empty</div>;
    
    return (
      <div className="space-y-1 p-4 font-mono text-sm">
        {code.map((instr, i) => {
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
            <div 
              key={i}
              className={`py-1 px-2 rounded flex items-center ${
                op === 'label' ? 'font-bold text-yellow-300 mt-2' : 'text-slate-300 ml-4'
              }`}
            >
              <span className="w-6 text-slate-600 text-xs select-none">{i + 1}</span>
              <span>{display}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-[#eab308]">Code Optimization</h2>
      <p className="mb-6 text-gray-300">
        Applies constant folding and basic dead code elimination to improve the intermediate code.
      </p>
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <div className="flex-1 border-2 border-[#eab308] bg-[#ca8a04]/10 rounded-xl flex flex-col overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.1)]">
          <div className="bg-[#ca8a04]/30 p-3 border-b border-[#eab308]/30 font-bold text-[#fde047] flex justify-between items-center">
            <span>Before Optimization</span>
            <span className="text-xs bg-[#ca8a04]/50 px-2 py-1 rounded text-[#fef08a]">{ir?.length || 0} Instructions</span>
          </div>
          <div className="flex-1 overflow-auto bg-black/20">
            {renderIR(ir)}
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center items-center px-2">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight size={32} className="text-[#eab308]" />
          </motion.div>
        </div>

        <div className="flex-1 border-2 border-[#eab308] bg-[#ca8a04]/20 rounded-xl flex flex-col overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <div className="bg-[#ca8a04]/40 p-3 border-b border-[#eab308]/30 font-bold text-[#fde047] flex justify-between items-center">
            <span>After Optimization</span>
            <span className="text-xs bg-[#ca8a04]/60 text-[#fef08a] px-2 py-1 rounded">{optimized?.length || 0} Instructions</span>
          </div>
          <div className="flex-1 overflow-auto bg-black/20">
            {renderIR(optimized)}
          </div>
        </div>
      </div>
    </div>
  );
};
