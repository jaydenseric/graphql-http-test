'use strict';

const { strictEqual } = require('assert');
const { spawnSync } = require('child_process');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');

module.exports = (tests) => {
  tests.add('`reportAuditResults` with status ok.', async () => {
    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [resolve(__dirname, '../fixtures/reportAuditResults-ok')],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout,
      resolve(__dirname, '../snapshots/reportAuditResults-ok-stdout.txt')
    );

    strictEqual(stderr, '');
    strictEqual(status, 0);
  });

  tests.add('`reportAuditResults` with status warn.', async () => {
    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [resolve(__dirname, '../fixtures/reportAuditResults-warn')],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    await snapshot(
      stdout,
      resolve(__dirname, '../snapshots/reportAuditResults-warn-stdout.txt')
    );

    strictEqual(stderr, '');
    strictEqual(status, 0);
  });

  tests.add('`reportAuditResults` with status error.', async () => {
    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [resolve(__dirname, '../fixtures/reportAuditResults-error')],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    if (error) throw error;

    strictEqual(stdout, '');

    await snapshot(
      stderr,
      resolve(__dirname, '../snapshots/reportAuditResults-error-stderr.txt')
    );

    strictEqual(status, 0);
  });
};
