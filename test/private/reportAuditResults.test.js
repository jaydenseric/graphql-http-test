'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const execFilePromise = require('../execFilePromise');

module.exports = (tests) => {
  tests.add('`reportAuditResults`.', async () => {
    const { stdout, stderr } = await execFilePromise('node', [
      resolve(__dirname, '../fixtures/reportAuditResults'),
    ]);

    await snapshot(
      stdout,
      resolve(__dirname, '../snapshots/reportAuditResults-stdout.txt')
    );

    strictEqual(stderr, '');
  });
};
