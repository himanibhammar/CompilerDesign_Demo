class Optimizer:
    def __init__(self, ir):
        self.ir = ir

    def optimize(self):
        optimized_ir = self.constant_folding(self.ir)
        optimized_ir = self.dead_code_elimination(optimized_ir)
        return optimized_ir

    def constant_folding(self, ir):
        # We'll do Constant Propagation + Folding
        constants = {}
        new_ir = []
        for instr in ir:
            op = instr['op']
            arg1 = constants.get(instr['arg1'], instr['arg1'])
            arg2 = constants.get(instr['arg2'], instr['arg2'])
            result = instr['result']

            if op == '=':
                if self.is_literal(arg1):
                    constants[result] = arg1
                new_ir.append({"op": op, "arg1": arg1, "arg2": "", "result": result})
            elif op in ['+', '-', '*', '/', '==', '!=', '<', '>', '<=', '>=', '&&', '||']:
                if self.is_literal(arg1) and self.is_literal(arg2):
                    try:
                        val1 = self.parse_literal(arg1)
                        val2 = self.parse_literal(arg2)
                        res = 0
                        
                        if op == '+': res = val1 + val2
                        elif op == '-': res = val1 - val2
                        elif op == '*': res = val1 * val2
                        elif op == '/': res = val1 / val2 if val2 != 0 else 0
                        elif op == '==': res = 1 if val1 == val2 else 0
                        elif op == '!=': res = 1 if val1 != val2 else 0
                        elif op == '<': res = 1 if val1 < val2 else 0
                        elif op == '>': res = 1 if val1 > val2 else 0
                        elif op == '<=': res = 1 if val1 <= val2 else 0
                        elif op == '>=': res = 1 if val1 >= val2 else 0
                        elif op == '&&': res = 1 if (val1 and val2) else 0
                        elif op == '||': res = 1 if (val1 or val2) else 0
                        
                        res_str = str(int(res)) if res == int(res) else str(res)
                        constants[result] = res_str
                        new_ir.append({"op": "=", "arg1": res_str, "arg2": "", "result": result})
                        continue
                    except Exception:
                        pass
                
                new_ir.append({"op": op, "arg1": arg1, "arg2": arg2, "result": result})
            elif op == 'if_false':
                if self.is_literal(arg1):
                    val = self.parse_literal(arg1)
                    if not val:
                        # jump is taken
                        new_ir.append({"op": "goto", "arg1": "", "arg2": "", "result": result})
                    else:
                        # jump is NOT taken, drop it
                        pass
                else:
                    new_ir.append({"op": op, "arg1": arg1, "arg2": instr['arg2'], "result": result})
            elif op == 'print':
                new_ir.append({"op": op, "arg1": arg1, "arg2": "", "result": ""})
            elif op == 'return':
                new_ir.append({"op": op, "arg1": arg1, "arg2": "", "result": ""})
            else:
                new_ir.append(instr)
                
        return new_ir

    def is_literal(self, s):
        if not s: return False
        if s.startswith("'") and s.endswith("'"): return True
        try:
            float(s)
            return True
        except ValueError:
            return False

    def parse_literal(self, s):
        if s.startswith("'") and s.endswith("'"):
            return ord(s[1])
        return float(s) if '.' in s else int(s)

    def dead_code_elimination(self, ir):
        used = set()
        for instr in ir:
            if instr['arg1']: used.add(instr['arg1'])
            if instr['arg2']: used.add(instr['arg2'])
            if instr['op'] in ['print', 'if_false', 'return']:
                if instr['arg1']: used.add(instr['arg1'])
        
        new_ir = []
        for instr in ir:
            if instr['op'] in ['=', '+', '-', '*', '/', '==', '!=', '<', '>', '<=', '>=', '&&', '||'] and instr['result'] and instr['result'].startswith('t'):
                if instr['result'] not in used:
                    continue
            new_ir.append(instr)
            
        # Optional: remove unreached code after gotos if needed, but basic DCE is fine
        return new_ir
