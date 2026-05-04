import re
from typing import List, Dict, Any

class Tokenizer:
    def __init__(self):
        self.token_specification = [
            ('PREPROC',  r'#.*'),              # Preprocessor directives (skip)
            ('NUMBER',   r'\d+(\.\d*)?'),  # Integer or decimal number
            ('STRING',   r'"[^"]*"'),      # String literal
            ('CHAR',     r"'[^']*'"),          # Character literal
            ('KEYWORD',  r'\b(int|char|void|if|else|switch|case|default|break|print|printf|return|main)\b'), # Keywords
            ('ID',       r'[A-Za-z_][A-Za-z0-9_]*'), # Identifiers
            ('OP',       r'(==|!=|<=|>=|&&|\|\||[+\-*/=><!])'), # Operators
            ('PUNCT',    r'[;{}():,]'),       # Punctuation
            ('SKIP',     r'[ \t\n]+'),       # Skip over spaces and tabs
            ('MISMATCH', r'.'),              # Any other character
        ]
        self.tok_regex = '|'.join('(?P<%s>%s)' % pair for pair in self.token_specification)

    def tokenize(self, code: str) -> List[Dict[str, Any]]:
        line_num = 1
        line_start = 0
        tokens = []
        for mo in re.finditer(self.tok_regex, code):
            kind = mo.lastgroup
            value = mo.group()
            column = mo.start() - line_start
            if kind == 'NUMBER':
                value = float(value) if '.' in value else int(value)
                tokens.append({'type': kind, 'value': value, 'line': line_num, 'column': column})
            elif kind == 'PREPROC':
                continue
            elif kind == 'CHAR':
                tokens.append({'type': 'CHAR', 'value': value, 'line': line_num, 'column': column})
            elif kind == 'KEYWORD':
                 if value == 'printf': value = 'print'
                 tokens.append({'type': kind, 'value': value, 'line': line_num, 'column': column})
            elif kind == 'ID':
                tokens.append({'type': kind, 'value': value, 'line': line_num, 'column': column})
            elif kind == 'OP':
                tokens.append({'type': kind, 'value': value, 'line': line_num, 'column': column})
            elif kind == 'STRING':
                tokens.append({'type': kind, 'value': value, 'line': line_num, 'column': column})
            elif kind == 'PUNCT':
                tokens.append({'type': kind, 'value': value, 'line': line_num, 'column': column})
            elif kind == 'SKIP':
                if '\n' in value:
                    line_num += value.count('\n')
                    line_start = mo.end() - len(value) + value.rfind('\n') + 1
                continue
            elif kind == 'MISMATCH':
                tokens.append({'type': 'ERROR', 'value': value, 'line': line_num, 'column': column})
                
        return tokens
