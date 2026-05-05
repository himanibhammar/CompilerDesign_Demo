# Compiler Visualizer

An interactive, multi-phase compiler pipeline visualizer. This project allows users to input source code and trace its compilation journey step-by-step through Lexical Analysis, Syntax Parsing, Semantic Analysis, Intermediate Representation (IR), Optimization, and Target Code Generation.

## Architecture

The project is split into a separated Frontend and Backend architecture:

- **Backend** (`/backend`): A Python FastAPI application that implements a classic 6-pass compiler.
- **Frontend** (`/frontend`): A Next.js web application providing an interactive UI to inspect the output of each compiler phase.

## The Compiler Phases

The backend implements the following distinct compiler phases from scratch:

1. **Lexical Analysis (Tokenizer)**: Uses regex patterns to scan raw source code and break it down into a stream of meaningful tokens (Keywords, Identifiers, Numbers, Operators, Punctuation).
2. **Syntax Analysis (Parser)**: A recursive descent parser that takes the token stream and builds a hierarchical Abstract Syntax Tree (AST), ensuring the code follows correct grammar rules.
3. **Semantic Analysis**: Traverses the AST to perform symbol table management, scope resolution, and checks for logical errors like using a variable before it is declared.
4. **Intermediate Representation (IR)**: Flattens the AST into "Three-Address Code", breaking down complex expressions into simple sequential steps with temporary variables and converting control flow into jumps/labels.
5. **Optimization**: Modifies the IR to be more efficient, implementing techniques like Constant Folding (evaluating math on literals at compile time) and Dead Code Elimination.
6. **Code Generation**: Translates the optimized IR into a pseudo-assembly language, managing basic CPU register allocation (`R1`-`R4`).

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser. By default, the frontend is configured to communicate with the local backend at `http://localhost:8000`.

## Deployment
 You can access the website here: https://compiler-design-demo.vercel.app/
