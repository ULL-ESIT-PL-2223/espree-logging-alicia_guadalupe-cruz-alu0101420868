import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

/**
 * @desc Transpile the input file and write the output to the output file.
 * @param {*} inputFile - The input file to transpile.
 * @param {*} outputFile - The output file to write the transpiled code to.
 */
export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8');
  let output = addLogging(input);
  if(outputFile === undefined) {
    console.log(output);
    return;
  }
  await fs.writeFile(outputFile, output);
}

/**
 * @desc Add logging to the code.
 * @param {*} code - The code to add logging to.
 * @returns {string} - The code with logging added.
 */
export function addLogging(code) {
  const ast = espree.parse(code, { ecmaVersion: 12, loc: true });
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if (node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' ||
          node.type === 'ArrowFunctionExpression') {
        addBeforeCode(node);
      }
    }
  });
  return escodegen.generate(ast);
}

/**
 * @desc Add logging code before the function.
 * @param {*} node - The function node.
 */
function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
  const params = node.params.map(p => '${ ' +  p.name + ' }').join(', ');
  const beforeCode = 'console.log(\`Entering ' + name + '(' + params + ') at line ' + node.loc.start.line + '\`);';
  const beforeNodes = espree.parse(beforeCode, { ecmaVersion: 12 }).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
