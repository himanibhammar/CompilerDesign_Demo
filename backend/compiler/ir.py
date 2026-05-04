class IRGenerator:
    def __init__(self, ast):
        self.ast = ast
        self.instructions = []
        self.temp_count = 0
        self.label_count = 0

    def new_temp(self):
        self.temp_count += 1
        return f"t{self.temp_count}"
        
    def new_label(self):
        self.label_count += 1
        return f"L{self.label_count}"

    def generate(self):
        if 'error' in self.ast:
            return [{"op": "ERROR", "arg1": self.ast['error'], "arg2": "", "result": ""}]
        self.visit(self.ast)
        return self.instructions
        
    def add_instruction(self, op, arg1="", arg2="", result=""):
        self.instructions.append({
            "op": op,
            "arg1": str(arg1),
            "arg2": str(arg2),
            "result": str(result)
        })

    def visit(self, node):
        if not node or not isinstance(node, dict):
            return ""
            
        node_type = node.get("type")
        if node_type == "Program":
            for stmt in node.get("body", []):
                self.visit(stmt)
            return ""

        elif node_type == "FunctionDeclaration":
            self.add_instruction("label", "", "", node.get("id"))
            for stmt in node.get("body", []):
                self.visit(stmt)
            return ""

        elif node_type == "BlockStatement":
            for stmt in node.get("body", []):
                self.visit(stmt)
            return ""
            
        elif node_type == "VariableDeclaration":
            if node.get("init"):
                val = self.visit(node.get("init"))
                self.add_instruction("=", val, "", node.get("id"))
            return node.get("id")
            
        elif node_type == "Assignment":
            val = self.visit(node.get("value"))
            self.add_instruction("=", val, "", node.get("id"))
            return node.get("id")
            
        elif node_type == "IfStatement":
            cond = self.visit(node.get("condition"))
            l_false = self.new_label()
            l_end = self.new_label()
            
            self.add_instruction("if_false", cond, "goto", l_false)
            
            for stmt in node.get("consequent", []):
                self.visit(stmt)
            
            self.add_instruction("goto", "", "", l_end)
            self.add_instruction("label", "", "", l_false)
            
            for stmt in node.get("alternate") or []:
                self.visit(stmt)
                
            self.add_instruction("label", "", "", l_end)
            return ""
            
        elif node_type == "PrintStatement":
            val = self.visit(node.get("expression"))
            self.add_instruction("print", val, "", "")
            return ""

        elif node_type == "ReturnStatement":
            val = self.visit(node.get("argument"))
            self.add_instruction("return", val, "", "")
            return ""
            
        elif node_type == "BinaryExpression":
            left = self.visit(node.get("left"))
            right = self.visit(node.get("right"))
            temp = self.new_temp()
            self.add_instruction(node.get("operator"), left, right, temp)
            return temp
            
        elif node_type == "Literal":
            return str(node.get("value"))
            
        elif node_type == "Identifier":
            return node.get("name")
            
        return ""
