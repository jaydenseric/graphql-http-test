'use strict';

const { Console } = require('console');

/**
 * The Node.js global `console` API, but all output is to `stderr`.
 * @kind member
 * @name errorConsole
 * @type {Console}
 * @ignore
 */
module.exports = new Console({
  stdout: process.stderr,
  stderr: process.stderr,
});
