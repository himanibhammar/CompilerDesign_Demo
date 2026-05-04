class Parser:
    def __init__(self, tokens):
        self.tokens = [t for t in tokens if t['type'] != 'ERROR']
        self.pos = 0

    def parse(self):
        try:
            return self.program()
        except Exception as e:
            return {"error": f"Unsupported syntax in syntax phase: {str(e)}"}

    def current_token(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None

    def consume(self, expected_type=None, expected_value=None):
        token = self.current_token()
        if not token:
            raise Exception("Unexpected end of input")
        if expected_type and token['type'] != expected_type:
            raise Exception(f"Expected {expected_type}, got {token['type']}")
        if expected_value and token['value'] != expected_value:
            raise Exception(f"Expected '{expected_value}', got '{token['value']}'")
        self.pos += 1
        return token

    def program(self):
        nodes = []
        while self.pos < len(self.tokens):
            token = self.current_token()
            if token and token['type'] == 'KEYWORD' and token['value'] in ['int', 'void'] and self.peek() and self.peek()['value'] == 'main':
                nodes.append(self.function_declaration())
            else:
                nodes.append(self.statement())
        return {"type": "Program", "body": nodes}

    def peek(self, offset=1):
        if self.pos + offset < len(self.tokens):
            return self.tokens[self.pos + offset]
        return None

    def function_declaration(self):
        dtype = self.consume('KEYWORD')['value']
        id_token = self.consume('KEYWORD')
        self.consume('PUNCT', '(')
        self.consume('PUNCT', ')')
        body = self.block_statement()
        return {
            "type": "FunctionDeclaration",
            "id": id_token['value'],
            "dtype": dtype,
            "body": body
        }

    def block_statement(self):
        self.consume('PUNCT', '{')
        nodes = []
        while self.current_token() and self.current_token()['value'] != '}':
            nodes.append(self.statement())
        self.consume('PUNCT', '}')
        return nodes

    def statement(self):
        token = self.current_token()
        if not token:
            raise Exception("Unexpected EOF in statement")
            
        if token['value'] == '{':
            return {"type": "BlockStatement", "body": self.block_statement()}

        if token['type'] == 'KEYWORD':
            if token['value'] in ['int', 'char']:
                return self.declaration()
            elif token['value'] == 'if':
                return self.if_statement()
            elif token['value'] == 'print':
                return self.print_statement()
            elif token['value'] == 'return':
                return self.return_statement()
            
        if token['type'] == 'ID':
            return self.assignment()
            
        raise Exception(f"Unexpected token {token['value']}")

    def declaration(self):
        dtype_token = self.consume('KEYWORD')
        id_token = self.consume('ID')
        
        init_val = None
        if self.current_token() and self.current_token()['value'] == '=':
            self.consume('OP', '=')
            init_val = self.expression()
            
        self.consume('PUNCT', ';')
        
        return {
            "type": "VariableDeclaration",
            "dtype": dtype_token['value'],
            "id": id_token['value'],
            "init": init_val
        }

    def assignment(self):
        id_token = self.consume('ID')
        self.consume('OP', '=')
        expr = self.expression()
        self.consume('PUNCT', ';')
        return {
            "type": "Assignment",
            "id": id_token['value'],
            "value": expr
        }
        
    def return_statement(self):
        self.consume('KEYWORD', 'return')
        expr = self.expression()
        self.consume('PUNCT', ';')
        return {
            "type": "ReturnStatement",
            "argument": expr
        }

    def if_statement(self):
        self.consume('KEYWORD', 'if')
        self.consume('PUNCT', '(')
        condition = self.expression()
        self.consume('PUNCT', ')')
        
        token = self.current_token()
        if token and token['value'] == '{':
            consequent = self.block_statement()
        else:
            consequent = [self.statement()]
        
        alternate = None
        if self.current_token() and self.current_token()['value'] == 'else':
            self.consume('KEYWORD', 'else')
            if self.current_token() and self.current_token()['value'] == '{':
                alternate = self.block_statement()
            elif self.current_token() and self.current_token()['value'] == 'if':
                alternate = [self.if_statement()]
            else:
                alternate = [self.statement()]
            
        return {
            "type": "IfStatement",
            "condition": condition,
            "consequent": consequent,
            "alternate": alternate
        }
        
    def print_statement(self):
        self.consume('KEYWORD', 'print')
        self.consume('PUNCT', '(')
        expr = self.expression()
        self.consume('PUNCT', ')')
        self.consume('PUNCT', ';')
        return {
            "type": "PrintStatement",
            "expression": expr
        }

    def expression(self):
        return self.logical_or()

    def logical_or(self):
        left = self.logical_and()
        while self.current_token() and self.current_token()['value'] == '||':
            op = self.consume('OP', '||')
            right = self.logical_and()
            left = {"type": "BinaryExpression", "operator": op['value'], "left": left, "right": right}
        return left

    def logical_and(self):
        left = self.equality()
        while self.current_token() and self.current_token()['value'] == '&&':
            op = self.consume('OP', '&&')
            right = self.equality()
            left = {"type": "BinaryExpression", "operator": op['value'], "left": left, "right": right}
        return left

    def equality(self):
        left = self.relational()
        while self.current_token() and self.current_token()['value'] in ['==', '!=']:
            op = self.consume('OP')
            right = self.relational()
            left = {"type": "BinaryExpression", "operator": op['value'], "left": left, "right": right}
        return left

    def relational(self):
        left = self.additive()
        while self.current_token() and self.current_token()['value'] in ['<', '>', '<=', '>=']:
            op = self.consume('OP')
            right = self.additive()
            left = {"type": "BinaryExpression", "operator": op['value'], "left": left, "right": right}
        return left

    def additive(self):
        left = self.multiplicative()
        while self.current_token() and self.current_token()['value'] in ['+', '-']:
            op = self.consume('OP')
            right = self.multiplicative()
            left = {"type": "BinaryExpression", "operator": op['value'], "left": left, "right": right}
        return left

    def multiplicative(self):
        left = self.term()
        while self.current_token() and self.current_token()['value'] in ['*', '/']:
            op = self.consume('OP')
            right = self.term()
            left = {"type": "BinaryExpression", "operator": op['value'], "left": left, "right": right}
        return left
    def term(self):
        token = self.current_token()
        if not token:
             raise Exception("Unexpected EOF in term")
        if token['type'] == 'NUMBER':
            self.consume('NUMBER')
            return {"type": "Literal", "value": token['value']}
        elif token['type'] == 'ID':
            self.consume('ID')
            return {"type": "Identifier", "name": token['value']}
        elif token['type'] == 'STRING':
            self.consume('STRING')
            return {"type": "Literal", "value": token['value']}
        elif token['type'] == 'CHAR':
            self.consume('CHAR')
            return {"type": "Literal", "value": token['value']}
        elif token['value'] == '(':
            self.consume('PUNCT', '(')
            expr = self.expression()
            self.consume('PUNCT', ')')
            return expr
        raise Exception(f"Unexpected token in expression: {token['value']}")
