'use strict';

const http = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditPostRequestDetailed = require('../../../private/audits/auditPostRequestDetailed');
const listen = require('../../listen');

module.exports = (tests) => {
  tests.add('`auditPostRequestDetailed` with a compliant server.', async () => {
    const server = http.createServer(async (request, response) => {
      response.writeHead(200, { 'Content-Type': 'application/graphql+json' });
      response.end(
        JSON.stringify(
          {
            data: {
              __type: {
                name: 'Query',
              },
            },
          },
          null,
          2
        )
      );
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditPostRequestDetailed({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditPostRequestDetailed-with-compliant-server.json'
        )
      );
    } finally {
      close();
    }
  });

  tests.add(
    '`auditPostRequestDetailed` with a non-compliant server.',
    async () => {
      const server = http.createServer(async (request, response) => {
        response.statusCode = 404;
        response.end();
      });

      const { port, close } = await listen(server);

      try {
        const result = await auditPostRequestDetailed({
          uri: `http://localhost:${port}`,
        });
        await snapshot(
          JSON.stringify(result, null, 2),
          resolve(
            __dirname,
            '../../snapshots/auditPostRequestDetailed-with-non-compliant-server.json'
          )
        );
      } finally {
        close();
      }
    }
  );
};
