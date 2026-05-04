class CodeGenerator:
    def __init__(self, ir):
        self.ir = ir
        self.assembly = []
        self.registers = ["R1", "R2", "R3", "R4"]
        self.var_to_reg = {}
        self.reg_idx = 0

    def get_reg(self, var):
        if var in self.var_to_reg:
            return self.var_to_reg[var]
        reg = self.registers[self.reg_idx % len(self.registers)]
        self.var_to_reg[var] = reg
        self.reg_idx += 1
        return reg

    def generate(self):
        for instr in self.ir:
            op = instr['op']
            arg1 = instr['arg1']
            arg2 = instr['arg2']
            result = instr['result']

            self.assembly.append(f"; IR: {op} {arg1} {arg2} {result}")
            
            if op == '=':
                if self.is_number(arg1):
                    reg = self.get_reg(result)
                    self.assembly.append(f"MOV {reg}, #{arg1}")
                elif self.is_literal(arg1):
                    reg = self.get_reg(result)
                    self.assembly.append(f"MOV {reg}, {arg1}")
                else:
                    reg1 = self.get_reg(arg1)
                    reg_res = self.get_reg(result)
                    if reg1 != reg_res:
                        self.assembly.append(f"MOV {reg_res}, {reg1}")
            elif op in ['+', '-', '*', '/', '&&', '||']:
                reg1 = self.get_reg(arg1)
                reg_res = self.get_reg(result)
                
                if reg1 != reg_res:
                    self.assembly.append(f"MOV {reg_res}, {reg1}")
                
                if self.is_number(arg2) or self.is_literal(arg2):
                    operand2 = f"#{arg2}"
                else:
                    operand2 = self.get_reg(arg2)
                    
                if op == '+': self.assembly.append(f"ADD {reg_res}, {operand2}")
                elif op == '-': self.assembly.append(f"SUB {reg_res}, {operand2}")
                elif op == '*': self.assembly.append(f"MUL {reg_res}, {operand2}")
                elif op == '/': self.assembly.append(f"DIV {reg_res}, {operand2}")
                elif op == '&&': self.assembly.append(f"AND {reg_res}, {operand2}")
                elif op == '||': self.assembly.append(f"OR {reg_res}, {operand2}")
                
            elif op in ['==', '!=', '<', '>', '<=', '>=']:
                reg1 = self.get_reg(arg1)
                if self.is_number(arg2) or self.is_literal(arg2):
                    operand2 = f"#{arg2}"
                else:
                    operand2 = self.get_reg(arg2)
                    
                reg_res = self.get_reg(result)
                
                self.assembly.append(f"CMP {reg1}, {operand2}")
                op_map = {'==': 'SETE', '!=': 'SETNE', '<': 'SETL', '>': 'SETG', '<=': 'SETLE', '>=': 'SETGE'}
                self.assembly.append(f"{op_map[op]} {reg_res}")
            elif op == 'if_false':
                reg1 = self.get_reg(arg1)
                self.assembly.append(f"CMP {reg1}, #0")
                self.assembly.append(f"JEQ {result}")
            elif op == 'goto':
                self.assembly.append(f"JMP {result}")
            elif op == 'label':
                self.assembly.append(f"{result}:")
            elif op == 'print':
                if self.is_number(arg1):
                    self.assembly.append(f"PRINT #{arg1}")
                else:
                    reg1 = self.get_reg(arg1)
                    self.assembly.append(f"PRINT {reg1}")
            elif op == 'return':
                if self.is_number(arg1):
                    self.assembly.append(f"RET #{arg1}")
                else:
                    reg1 = self.get_reg(arg1)
                    self.assembly.append(f"RET {reg1}")
                    
        return [{"instruction": line} for line in self.assembly]
        
    def is_number(self, s):
        if not s: return False
        try:
            float(s)
            return True
        except ValueError:
            return False
            
    def is_literal(self, s):
        if not s: return False
        return s.startswith("'") and s.endswith("'")
