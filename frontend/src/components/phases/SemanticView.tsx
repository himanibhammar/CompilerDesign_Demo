import React from 'react';
import { CompilerData } from '@/types';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const SemanticView = ({ semantic }: { semantic: CompilerData['semantic'] }) => {
  return (
    <div className="w-full h-full p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">Semantic Analysis</h2>
      <p className="mb-6 text-gray-300">
        The semantic analyzer builds a symbol table and checks for semantic errors (e.g., using a variable before declaration).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-[#b45309] bg-[#78350f]/20 p-6 rounded-xl shadow-[0_0_15px_rgba(180,83,9,0.15)]">
          <h3 className="text-lg font-bold text-[#fcd34d] mb-4 border-b border-[#b45309]/50 pb-2">Symbol Table</h3>
          {semantic?.symbol_table?.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Identifier Name</th>
                  <th className="pb-3 font-medium">Data Type</th>
                  <th className="pb-3 font-medium">Scope</th>
                </tr>
              </thead>
              <tbody>
                {semantic.symbol_table.map((symbol, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="border-t border-slate-700/50"
                  >
                    <td className="py-3 font-mono text-blue-300">{symbol.name}</td>
                    <td className="py-3 text-emerald-400">{symbol.type}</td>
                    <td className="py-3 text-slate-300">{symbol.scope}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[#fbbf24]/60 italic">Symbol table is empty.</p>
          )}

          <div className="mt-8 pt-4 border-t border-[#b45309]/50">
            <h4 className="font-bold text-[#fcd34d] mb-2">Semantic Analysis checks:</h4>
            <ul className="list-disc pl-5 text-[#fde68a] text-sm space-y-1">
              <li>Type Correctness</li>
              <li>Variable declaration</li>
              <li>Valid Operations</li>
              <li>Meaning of expressions</li>
            </ul>
          </div>
        </div>

        <div className="border-2 border-[#b45309] bg-[#78350f]/20 p-6 rounded-xl flex flex-col shadow-[0_0_15px_rgba(180,83,9,0.15)]">
          <h3 className="text-lg font-bold text-[#fcd34d] mb-4 border-b border-[#b45309]/50 pb-2 flex items-center gap-2">
            Analysis Status
          </h3>
          
          {semantic?.errors?.length > 0 ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex-1">
              <div className="flex items-center gap-2 text-red-400 mb-3 font-semibold">
                <AlertCircle size={20} />
                <span>Errors Detected</span>
              </div>
              <ul className="space-y-2">
                {semantic.errors.map((err, i) => (
                  <li key={i} className="text-red-200 text-sm flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex-1 flex flex-col items-center justify-center text-center">
              <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
              <p className="text-emerald-400 font-medium text-lg">Analysis Passed</p>
              <p className="text-emerald-200/70 mt-2 text-sm">No semantic errors found in the source code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
