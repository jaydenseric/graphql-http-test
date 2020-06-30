'use strict';

const { execSync } = require('child_process');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');

module.exports = (tests) => {
  tests.add('`reportAuditResults`.', async () => {
    const stdout = execSync(
      `node ${resolve(__dirname, '../fixtures/reportAuditResults')}`,
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      }
    );

    await snapshot(
      stdout,
      resolve(__dirname, '../snapshots/reportAuditResults-stdout.txt')
    );
  });
};
