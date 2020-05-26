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
    const { output, exitCode } = await recordChildProcess(
      spawn('node', [cliPath])
    );

    strictEqual(exitCode, 1);

    await snapshot(
      JSON.stringify(
        {
          stdout: stripStackTraces(output.stdout),
          stderr: stripStackTraces(output.stderr),
        },
        null,
        2
      ),
      resolve(__dirname, '../snapshots/cli-output-without-uri-arg.json')
    );
  });

  tests.add('`graphql-http-test` CLI with a compliant server.', async () => {
    const { port, close } = await startServer(koaAppCompliant);

    try {
      const { output, exitCode } = await recordChildProcess(
        spawn('node', [cliPath, `http://localhost:${port}`])
      );

      strictEqual(exitCode, 0);

      await snapshot(
        JSON.stringify(output, null, 2),
        resolve(__dirname, '../snapshots/cli-output-compliant.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`graphql-http-test` CLI with a noncompliant server.', async () => {
    const { port, close } = await startServer(koaAppNonCompliant);

    try {
      const uri = `http://localhost:${port}`;
      const { output, exitCode } = await recordChildProcess(
        spawn('node', [cliPath, uri])
      );

      strictEqual(exitCode, 1);

      await snapshot(
        JSON.stringify(
          {
            stdout: output.stdout.replace(uri, '<uri>'),
            stderr: output.stderr.replace(uri, '<uri>'),
          },
          null,
          2
        ),
        resolve(
          __dirname,
          `../snapshots/cli-output-noncompliant-node-v${nodeMajorVersion}.json`
        )
      );
    } finally {
      close();
    }
  });
};
