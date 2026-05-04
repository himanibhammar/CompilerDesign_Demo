import React from 'react';
import { Token } from '@/types';
import { motion } from 'framer-motion';

export const LexicalView = ({ tokens }: { tokens: Token[] }) => {
  return (
    <div className="w-full h-full p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Lexical Analysis</h2>
      <p className="mb-6 text-gray-300">
        The tokenizer converts the raw source code into a sequence of tokens, categorized by their type.
      </p>
      
      <div className="rounded-lg border-2 border-green-700 bg-green-800/20 p-6 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        <div className="flex flex-wrap gap-2 font-mono text-sm leading-relaxed text-green-300">
          {tokens.map((token, i) => {
            let typeLabel = token.type.toLowerCase();
            if (typeLabel === 'op') typeLabel = 'operator';
            
            return (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
                key={i} 
                className="whitespace-nowrap"
              >
                &lt;{typeLabel}, {token.value}&gt;
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
