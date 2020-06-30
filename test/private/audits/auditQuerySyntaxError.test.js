'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditQuerySyntaxError = require('../../../private/audits/auditQuerySyntaxError');
const listen = require('../../listen');

module.exports = (tests) => {
  tests.add('`auditQuerySyntaxError` with status ok.', async () => {
    const server = createServer(async (request, response) => {
      response.writeHead(400, { 'Content-Type': 'application/graphql+json' });
      response.end(
        JSON.stringify(
          { errors: [{ message: 'Query syntax error.' }] },
          null,
          2
        )
      );
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'POST'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditQuerySyntaxError-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditQuerySyntaxError` with status error, GET.', async () => {
    const server = createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'GET'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditQuerySyntaxError-error.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditQuerySyntaxError` with status error, POST.', async () => {
    const server = createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditQuerySyntaxError(
        { uri: `http://localhost:${port}` },
        'POST'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditQuerySyntaxError-error.json')
      );
    } finally {
      close();
    }
  });
};
