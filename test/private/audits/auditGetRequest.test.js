'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditGetRequest = require('../../../private/audits/auditGetRequest');
const listen = require('../../listen');
const testQueryData = require('../../testQueryData');

module.exports = (tests) => {
  tests.add('`auditGetRequest` with status ok.', async () => {
    const server = createServer(async (request, response) => {
      response.writeHead(200, { 'Content-Type': 'application/graphql+json' });
      response.end(JSON.stringify({ data: testQueryData }, null, 2));
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditGetRequest({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetRequest-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditGetRequest` with status error.', async () => {
    const server = createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditGetRequest({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetRequest-error.json')
      );
    } finally {
      close();
    }
  });
};
