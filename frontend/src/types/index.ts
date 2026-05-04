export interface Token {
  type: string;
  value: string | number;
  line: number;
  column: number;
}

export interface CompilerData {
  tokens: Token[];
  parse_tree: any;
  semantic: {
    symbol_table: { name: string; type: string; scope: string }[];
    errors: string[];
  };
  ir: { op: string; arg1: string; arg2: string; result: string }[];
  optimized: { op: string; arg1: string; arg2: string; result: string }[];
  target: { instruction: string }[];
}

export type Phase = 
  | 'input'
  | 'lexical'
  | 'syntax'
  | 'semantic'
  | 'ir'
  | 'optimization'
  | 'codegen'
  | 'calculation';
