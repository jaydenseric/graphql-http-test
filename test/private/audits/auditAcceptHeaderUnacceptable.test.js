'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditAcceptHeaderUnacceptable = require('../../../private/audits/auditAcceptHeaderUnacceptable');
const listen = require('../../listen');

const serverOk = createServer(async (request, response) => {
  response.writeHead(406, { 'Content-Type': 'application/graphql+json' });
  response.end(
    JSON.stringify({ errors: [{ message: 'Not acceptable.' }] }, null, 2)
  );
});

const serverError = createServer(async (request, response) => {
  response.statusCode = 404;
  response.end();
});

module.exports = (tests) => {
  tests.add(
    '`auditAcceptHeaderUnacceptable` with GET, status ok.',
    async () => {
      const { port, close } = await listen(serverOk);

      try {
        const result = await auditAcceptHeaderUnacceptable(
          { uri: `http://localhost:${port}` },
          'GET'
        );
        await snapshot(
          JSON.stringify(result, null, 2),
          resolve(
            __dirname,
            '../../snapshots/auditAcceptHeaderUnacceptable-GET-ok.json'
          )
        );
      } finally {
        close();
      }
    }
  );

  tests.add(
    '`auditAcceptHeaderUnacceptable` with GET, status error.',
    async () => {
      const { port, close } = await listen(serverError);

      try {
        const result = await auditAcceptHeaderUnacceptable(
          { uri: `http://localhost:${port}` },
          'GET'
        );
        await snapshot(
          JSON.stringify(result, null, 2),
          resolve(
            __dirname,
            '../../snapshots/auditAcceptHeaderUnacceptable-GET-error.json'
          )
        );
      } finally {
        close();
      }
    }
  );

  tests.add(
    '`auditAcceptHeaderUnacceptable` with POST, status ok.',
    async () => {
      const { port, close } = await listen(serverOk);

      try {
        const result = await auditAcceptHeaderUnacceptable(
          { uri: `http://localhost:${port}` },
          'POST'
        );
        await snapshot(
          JSON.stringify(result, null, 2),
          resolve(
            __dirname,
            '../../snapshots/auditAcceptHeaderUnacceptable-POST-ok.json'
          )
        );
      } finally {
        close();
      }
    }
  );

  tests.add(
    '`auditAcceptHeaderUnacceptable` with POST, status error.',
    async () => {
      const { port, close } = await listen(serverError);

      try {
        const result = await auditAcceptHeaderUnacceptable(
          { uri: `http://localhost:${port}` },
          'POST'
        );
        await snapshot(
          JSON.stringify(result, null, 2),
          resolve(
            __dirname,
            '../../snapshots/auditAcceptHeaderUnacceptable-POST-error.json'
          )
        );
      } finally {
        close();
      }
    }
  );
};
