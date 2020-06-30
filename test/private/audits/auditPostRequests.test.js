'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const getRawBody = require('raw-body');
const snapshot = require('snapshot-assertion');
const auditPostRequests = require('../../../private/audits/auditPostRequests');
const listen = require('../../listen');
const testQueryData = require('../../testQueryData');

module.exports = (tests) => {
  tests.add('`auditPostRequests` with status ok.', async () => {
    const server = createServer(async (request, response) => {
      const body = await getRawBody(request);
      const { query } = JSON.parse(body);

      if (query === '{}') {
        response.writeHead(400, { 'Content-Type': 'application/graphql+json' });
        response.end(
          JSON.stringify(
            { errors: [{ message: 'Query syntax error.' }] },
            null,
            2
          )
        );
      } else {
        response.writeHead(200, { 'Content-Type': 'application/graphql+json' });
        response.end(JSON.stringify({ data: testQueryData }, null, 2));
      }
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditPostRequests({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditPostRequests-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditPostRequests` with status warn.', async () => {
    const server = createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditPostRequests({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditPostRequests-warn.json')
      );
    } finally {
      close();
    }
  });
};
