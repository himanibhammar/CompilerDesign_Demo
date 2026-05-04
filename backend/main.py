from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from compiler.tokenizer import Tokenizer
from compiler.parser import Parser
from compiler.semantic import SemanticAnalyzer
from compiler.ir import IRGenerator
from compiler.optimizer import Optimizer
from compiler.codegen import CodeGenerator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.post("/compile")
async def compile_code(request: CodeRequest):
    code = request.code
    
    # 1. Lexical Analysis
    tokenizer = Tokenizer()
    tokens = tokenizer.tokenize(code)
    
    # 2. Syntax Analysis
    parser = Parser(tokens)
    parse_tree = parser.parse()
    
    # 3. Semantic Analysis
    semantic = SemanticAnalyzer(parse_tree)
    semantic_result = semantic.analyze()
    
    # 4. Intermediate Representation
    ir_gen = IRGenerator(parse_tree)
    ir = ir_gen.generate()
    
    # 5. Code Optimization
    optimizer = Optimizer(ir)
    optimized_ir = optimizer.optimize()
    
    # 6. Target Code Generation
    codegen = CodeGenerator(optimized_ir)
    target = codegen.generate()
    
    return {
        "tokens": tokens,
        "parse_tree": parse_tree,
        "semantic": semantic_result,
        "ir": ir,
        "optimized": optimized_ir,
        "target": target
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
