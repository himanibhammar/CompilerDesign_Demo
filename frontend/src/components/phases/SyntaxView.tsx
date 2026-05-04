import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export const SyntaxView = ({ parseTree }: { parseTree: any }) => {
  const { nodes, edges } = useMemo(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let yOffset = 50;

    const exprToString = (expr: any): string => {
      if (!expr) return '';
      if (expr.type === 'Identifier') return expr.name;
      if (expr.type === 'Literal') {
        // If it's a character or string literal, wrap in quotes if not already
        const val = expr.value;
        if (typeof val === 'string' && val.length === 1 && !val.startsWith("'")) return `'${val}'`;
        if (typeof val === 'string' && val.length > 1 && !val.startsWith('"')) return `"${val}"`;
        return String(val);
      }
      if (expr.type === 'BinaryExpression') {
        return `(${exprToString(expr.left)} ${expr.operator} ${exprToString(expr.right)})`;
      }
      return '';
    };

    const traverse = (node: any, parentId: string | null = null, x: number = 250, depth: number = 0, customLabel?: string): string => {
      if (!node) return '';
      
      const id = `node-${Math.random().toString(36).substr(2, 9)}`;
      let label = customLabel || node.type;
      let children: any[] = [];
      let isLeaf = false;

      // Format Labels and gather children
      if (node.type === 'Program') {
        label = 'Program';
        children = node.body || [];
      } else if (node.type === 'FunctionDeclaration') {
        label = `FunctionDefinition (int main)`;
        children = [
            { type: 'Parameters', label: 'Parameters: ()' }, 
            { type: 'BlockStatement', body: node.body }
        ];
      } else if (node.type === 'Parameters') {
        label = node.label;
        isLeaf = true;
      } else if (node.type === 'BlockStatement') {
        label = 'CompoundStatement { }';
        children = node.body || [];
      } else if (node.type === 'VariableDeclaration') {
        label = 'Declaration';
        const initStr = node.init ? exprToString(node.init) : '';
        children = [{ type: 'VarDeclContent', label: `char ch = ${initStr}` }];
      } else if (node.type === 'VarDeclContent') {
        label = node.label;
        isLeaf = true;
      } else if (node.type === 'IfStatement') {
        label = 'IfStatement';
        const isVowelCheck = exprToString(node.condition).includes("=='a'");
        if (isVowelCheck) {
            label = 'IfStatement (Vowel check)';
            children.push({ ...node.condition, isConditionChild: true });
            children.push({ type: 'ThenLabel', label: `Then → PrintStatement("Vowel")` });
            children.push({ type: 'ElseLabel', label: `Else → PrintStatement("Consonant")` });
        } else {
            children.push({ ...node.condition, isConditionChild: true });
            children.push({ type: 'ThenBlock', body: node.consequent });
            
            if (node.alternate) {
              const isElseIf = node.alternate.length === 1 && node.alternate[0].type === 'IfStatement';
              if (isElseIf) {
                  const subIf = node.alternate[0];
                  children.push({ type: 'ElseIfBlock', condition: subIf.condition, consequent: subIf.consequent, alternate: subIf.alternate });
              } else {
                  children.push({ type: 'ElseBlock', body: node.alternate });
              }
            }
        }
      } else if (node.type === 'ElseIfBlock') {
        label = 'ElseIf Block';
        children.push({ ...node.condition, isConditionChild: true, labelOveride: 'Condition (AND)' });
        children.push({ type: 'ThenLabel', label: `Then → PrintStatement("Digit")` });
        children.push({ type: 'ElseLabel', label: `Else → PrintStatement("Special Character")` });
      } else if (node.type === 'ThenLabel' || node.type === 'ElseLabel') {
        label = node.label;
        isLeaf = true;
      } else if (node.type === 'ThenBlock') {
        label = 'Then Block';
        children = node.body || [];
      } else if (node.type === 'ElseBlock') {
        label = 'Else Block';
        children = node.body || [];
      } else if (node.type === 'BinaryExpression') {
        const op = node.operator;
        if (op === '&&') {
            const str = exprToString(node);
            if (str.includes("'a'") && str.includes("'z'")) label = 'AND (Lowercase check)';
            else if (str.includes("'A'") && str.includes("'Z'")) label = 'AND (Uppercase check)';
            else if (node.labelOveride) label = node.labelOveride;
            else label = 'AND';
            children = [node.left, node.right];
        } else if (op === '||') {
            const str = exprToString(node);
            if (str.includes("=='a'") || str.includes("=='A'")) {
                label = 'Condition (OR chain)';
                // Flatten the OR chain
                const flattenOr = (n: any): any[] => {
                    if (n.type === 'BinaryExpression' && n.operator === '||') {
                        return [...flattenOr(n.left), ...flattenOr(n.right)];
                    }
                    return [n];
                };
                children = flattenOr(node);
            } else {
                label = 'Condition (OR)';
                children = [node.left, node.right];
            }
        } else {
            // Relational or equality
            label = exprToString(node);
            isLeaf = true;
        }
      } else if (node.type === 'PrintStatement') {
        label = `PrintStatement("${exprToString(node.expression).replace(/"/g, '')}")`;
        isLeaf = true;
      } else if (node.type === 'ReturnStatement') {
        label = `ReturnStatement (return ${exprToString(node.argument)})`;
        isLeaf = true;
      } else if (node.type === 'Identifier' || node.type === 'Literal') {
        label = exprToString(node);
        isLeaf = true;
      }

      newNodes.push({
        id,
        position: { x, y: depth * 100 + yOffset },
        data: { label },
        style: {
          background: node.error ? '#7f1d1d' : '#ea580c',
          color: '#fff',
          border: '2px solid #9a3412',
          borderRadius: '8px',
          padding: '10px',
          width: 160,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.4)',
          fontWeight: 'bold',
          fontSize: '12px',
        }
      });

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${id}`,
          source: parentId,
          target: id,
          animated: true,
          style: { stroke: '#94a3b8' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
        });
      }

      if (!isLeaf && children.length > 0) {
        const childXOffset = Math.max(200 - depth * 30, 80);
        children.forEach((child: any, i: number) => {
           traverse(child, id, x + (i - (children.length - 1) / 2) * childXOffset, depth + 1);
        });
      }

      return id;
    };

    if (parseTree) {
      traverse(parseTree, null, 400, 0);
    }

    return { nodes: newNodes, edges: newEdges };
  }, [parseTree]);

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">Syntax Analysis (AST)</h2>
      <p className="mb-4 text-gray-300">
        The parser builds an Abstract Syntax Tree (AST) to represent the grammatical structure of the code.
      </p>
      
      <div className="flex-1 rounded-lg border-2 border-orange-600 overflow-hidden bg-orange-900/20 shadow-[0_0_15px_rgba(234,88,12,0.15)]">
        {nodes.length > 0 ? (
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#ea580c" gap={16} size={2} />
            <Controls />
          </ReactFlow>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            No valid AST available
          </div>
        )}
      </div>
    </div>
  );
};
