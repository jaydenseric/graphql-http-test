'use strict';

const { strictEqual } = require('assert');
const { spawnSync } = require('child_process');
const http = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const listen = require('../listen');
const stripStackTraces = require('../stripStackTraces');

const cliPath = resolve(__dirname, '../../cli/graphql-http-test');

module.exports = (tests) => {
  tests.add('`graphql-http-test` CLI without the URI argument.', async () => {
    const { stdout, stderr, status, error } = spawnSync('node', [cliPath], {
      encoding: 'utf8',
    });

    if (error) throw error;

    strictEqual(stdout, '');

    await snapshot(
      stripStackTraces(stderr),
      resolve(__dirname, '../snapshots/cli-without-uri-arg-stderr.txt')
    );

    strictEqual(status, 1);
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
        const { stdout, stderr, status, error } = spawnSync(
          'node',
          [cliPath, `https:localhost:${port}`],
          { encoding: 'utf8' }
        );

        if (error) throw error;

        strictEqual(stdout, '');

        await snapshot(
          stripStackTraces(stderr),
          resolve(
            __dirname,
            '../snapshots/cli-with-non-compliant-server-stderr.txt'
          )
        );

        strictEqual(status, 1);
      } finally {
        close();
      }
    }
  );
};
