import assert from 'assert';
import * as fs from "fs/promises";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { transpile } from "../src/logging-espree.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
import Tst from './test-description.mjs';

/**
 * @desc Convert the test description to an array of test objects.
 */
const Test = Tst.map(t => ({
  input: __dirname + '/data/' + t.input,
  output: __dirname + '/data/' + t.output,
  correctLogged: __dirname + '/data/' + t.correctLogged,
  correctOut: __dirname + '/data/' + t.correctOut,
})
)

/**
 * @desc Remove all spaces from a string.
 * @param {*} s - The string to remove spaces from.
 * @returns {string} - The string with spaces removed.
 */
function removeSpaces(s) {
  return s.replace(/\s/g, '');
}

/**
 * @desc Run the tests.
 */
for (let i = 0; i < Test.length; i++) {
  it ('Test ' + i, async function () {
    const t = Test[i];
    await transpile(t.input, t.output);
    const correctLogged = await fs.readFile(t.correctLogged, 'utf-8');
    assert.equal(removeSpaces(correctLogged), removeSpaces(await fs.readFile(t.output, 'utf-8')));

    let outputs = [];
    let oldLog = console.log;
    console.log =
        function(...args) {
      outputs.push(args.join(' '));
    }

    await import(t.output);
    console.log = oldLog;
    const correctOut = await fs.readFile(t.correctOut, 'utf-8');
    assert.equal(removeSpaces(outputs.join('\n')), removeSpaces(correctOut));
  });
}


