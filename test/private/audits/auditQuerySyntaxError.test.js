'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditQuerySyntaxError = require('../../../private/audits/auditQuerySyntaxError');
const listen = require('../../listen');

const serverOk = createServer(async (request, response) => {
  response.writeHead(400, { 'Content-Type': 'application/graphql+json' });
  response.end(
    JSON.stringify({ errors: [{ message: 'Query syntax error.' }] }, null, 2)
  );
});

const serverError = createServer(async (request, response) => {
  response.statusCode = 404;
  response.end();
});

module.exports = (tests) => {
  tests.add('`auditQuerySyntaxError` with GET, status ok.', async () => {
    const { port, close } = await listen(serverOk);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'GET'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditQuerySyntaxError-POST-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditQuerySyntaxError` with GET, status error.', async () => {
    const { port, close } = await listen(serverError);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'GET'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditQuerySyntaxError-GET-error.json'
        )
      );
    } finally {
      close();
    }
  });

  tests.add('`auditQuerySyntaxError` with POST, status ok.', async () => {
    const { port, close } = await listen(serverOk);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'POST'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditQuerySyntaxError-POST-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditQuerySyntaxError` with POST, status error.', async () => {
    const { port, close } = await listen(serverError);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'POST'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditQuerySyntaxError-POST-error.json'
        )
      );
    } finally {
      close();
    }
  });
};
