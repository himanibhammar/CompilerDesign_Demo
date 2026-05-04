class SemanticAnalyzer:
    def __init__(self, ast):
        self.ast = ast
        self.symbol_table = {}
        self.errors = []

    def analyze(self):
        if 'error' in self.ast:
            return {"symbol_table": {}, "errors": [self.ast['error']]}
            
        self.visit(self.ast)
        
        # Convert symbol table to a list format for frontend
        st_list = [{"name": k, "type": v["type"], "scope": v["scope"]} for k, v in self.symbol_table.items()]
        
        return {
            "symbol_table": st_list,
            "errors": self.errors
        }

    def visit(self, node):
        if not node or not isinstance(node, dict):
            return
            
        node_type = node.get("type")
        if node_type == "Program":
            for stmt in node.get("body", []):
                self.visit(stmt)
        elif node_type == "FunctionDeclaration":
            self.symbol_table[node.get("id")] = {"type": f"function returning {node.get('dtype')}", "scope": "global"}
            for stmt in node.get("body", []):
                self.visit(stmt)
        elif node_type == "BlockStatement":
            for stmt in node.get("body", []):
                self.visit(stmt)
        elif node_type == "VariableDeclaration":
            id_name = node.get("id")
            dtype = node.get("dtype")
            if id_name in self.symbol_table:
                self.errors.append(f"Variable '{id_name}' is already declared.")
            else:
                self.symbol_table[id_name] = {"type": dtype, "scope": "global"}
                
            if node.get("init"):
                self.visit(node.get("init"))
        elif node_type == "Assignment":
            id_name = node.get("id")
            if id_name not in self.symbol_table:
                self.errors.append(f"Variable '{id_name}' used before declaration.")
            self.visit(node.get("value"))
        elif node_type == "IfStatement":
            self.visit(node.get("condition"))
            for stmt in node.get("consequent", []):
                self.visit(stmt)
            for stmt in node.get("alternate") or []:
                self.visit(stmt)
        elif node_type == "PrintStatement":
            self.visit(node.get("expression"))
        elif node_type == "ReturnStatement":
            self.visit(node.get("argument"))
        elif node_type == "BinaryExpression":
            self.visit(node.get("left"))
            self.visit(node.get("right"))
        elif node_type == "Identifier":
            id_name = node.get("name")
            if id_name not in self.symbol_table:
                self.errors.append(f"Variable '{id_name}' used before declaration.")
