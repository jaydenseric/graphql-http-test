'use strict';

const { strictEqual } = require('assert');
const { spawn } = require('child_process');
const http = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const listen = require('../listen');
const recordChildProcess = require('../recordChildProcess');
const stripStackTraces = require('../stripStackTraces');

const cliPath = resolve(__dirname, '../../cli/graphql-http-test');

module.exports = (tests) => {
  tests.add('`graphql-http-test` CLI without the URI argument.', async () => {
    const { stdout, stderr, exitCode } = await recordChildProcess(
      spawn('node', [cliPath])
    );

    strictEqual(stdout, '');

    await snapshot(
      stripStackTraces(stderr),
      resolve(__dirname, '../snapshots/cli-without-uri-arg-stderr.txt')
    );

    strictEqual(exitCode, 1);
  });

  tests.add(
    '`graphql-http-test` CLI with a non-compliant server.',
    async () => {
      const server = http.createServer(async (request, response) => {
        response.statusCode = 404;
        response.end();
      });

      const { port, close } = await listen(server);

      try {
        const { stdout, stderr, exitCode } = await recordChildProcess(
          spawn('node', [cliPath, `https:localhost:${port}`])
        );

        strictEqual(stdout, '');

        await snapshot(
          stripStackTraces(stderr),
          resolve(
            __dirname,
            '../snapshots/cli-with-non-compliant-server-stderr.txt'
          )
        );

        strictEqual(exitCode, 1);
      } finally {
        close();
      }
    }
  );
};
