'use strict';

const { strictEqual } = require('assert');
const { spawn } = require('child_process');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const koaAppCompliant = require('../koaAppCompliant');
const koaAppNonCompliant = require('../koaAppNonCompliant');
const nodeMajorVersion = require('../nodeMajorVersion');
const recordChildProcess = require('../recordChildProcess');
const startServer = require('../startServer');
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
      resolve(__dirname, '../snapshots/cli-output-without-uri-arg-stderr.txt')
    );

    strictEqual(exitCode, 1);
  });

  tests.add('`graphql-http-test` CLI with a compliant server.', async () => {
    const { port, close } = await startServer(koaAppCompliant);

    try {
      const { stdout, stderr, exitCode } = await recordChildProcess(
        spawn('node', [cliPath, `http://localhost:${port}`])
      );

      await snapshot(
        stdout,
        resolve(__dirname, '../snapshots/cli-output-compliant-stdout.txt')
      );

      strictEqual(stderr, '');

      strictEqual(exitCode, 0);
    } finally {
      close();
    }
  });

  tests.add('`graphql-http-test` CLI with a noncompliant server.', async () => {
    const { port, close } = await startServer(koaAppNonCompliant);

    try {
      const uri = `http://localhost:${port}`;
      const { stdout, stderr, exitCode } = await recordChildProcess(
        spawn('node', [cliPath, uri])
      );

      await snapshot(
        stdout,
        resolve(__dirname, `../snapshots/cli-output-noncompliant-stdout.txt`)
      );

      await snapshot(
        stderr.replace(uri, '<uri>'),
        resolve(
          __dirname,
          `../snapshots/cli-output-noncompliant-stderr-node-v${nodeMajorVersion}.txt`
        )
      );

      strictEqual(exitCode, 1);
    } finally {
      close();
    }
  });
};
