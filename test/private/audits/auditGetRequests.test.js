'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditGetRequests = require('../../../private/audits/auditGetRequests');
const testQuerySyntaxError = require('../../../private/testQuerySyntaxError');
const listen = require('../../listen');
const testQueryData = require('../../testQueryData');

module.exports = (tests) => {
  tests.add('`auditGetRequests` with status ok.', async () => {
    const server = createServer(async (request, response) => {
      const query = new URL(
        request.url,
        `http://${request.headers.host}`
      ).searchParams.get('query');

      if (query === testQuerySyntaxError) {
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
      const result = await auditGetRequests({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetRequests-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditGetRequests` with status warn.', async () => {
    const server = createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditGetRequests({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetRequests-warn.json')
      );
    } finally {
      close();
    }
  });
};
