'use strict';

const { strictEqual } = require('assert');
const { spawn } = require('child_process');
const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const listen = require('../listen');
const recordChildProcess = require('../recordChildProcess');

const cliPath = resolve(__dirname, '../../cli/graphql-http-test');

module.exports = (tests) => {
  tests.add('`graphql-http-test` CLI without the URI argument.', async () => {
    const { stdout, stderr, exitCode } = await recordChildProcess(
      spawn('node', [cliPath], {
        env: {
          ...process.env,
          FORCE_COLOR: 1,
        },
      })
    );

    strictEqual(stdout, '');

    await snapshot(
      stderr,
      resolve(
        __dirname,
        '../snapshots/graphql-http-test-cli-without-uri-arg-stderr.txt'
      )
    );

    strictEqual(exitCode, 1);
  });

  tests.add('`graphql-http-test` CLI with status error.', async () => {
    const server = createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const { stdout, stderr, exitCode } = await recordChildProcess(
        spawn('node', [cliPath, `http://localhost:${port}`], {
          env: {
            ...process.env,
            FORCE_COLOR: 1,
          },
        })
      );

      strictEqual(stdout, '');

      await snapshot(
        stderr,
        resolve(
          __dirname,
          '../snapshots/graphql-http-test-cli-error-stderr.txt'
        )
      );

      strictEqual(exitCode, 1);
    } finally {
      close();
    }
  });
};
