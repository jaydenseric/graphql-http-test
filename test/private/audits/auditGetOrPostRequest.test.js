'use strict';

const http = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditGetOrPostRequest = require('../../../private/audits/auditGetOrPostRequest');
const listen = require('../../listen');

module.exports = (tests) => {
  tests.add('`auditGetOrPostRequest` with status ok.', async () => {
    const server = http.createServer(async (request, response) => {
      response.writeHead(200, { 'Content-Type': 'application/graphql+json' });
      response.end(
        JSON.stringify(
          {
            data: {
              __schema: {
                queryType: {
                  name: 'Query',
                },
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
      const result = await auditGetOrPostRequest({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetOrPostRequest-ok.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditGetOrPostRequest` with status warn.', async () => {
    const server = http.createServer(async (request, response) => {
      if (request.method === 'POST') {
        response.writeHead(200, { 'Content-Type': 'application/graphql+json' });
        response.end(
          JSON.stringify(
            {
              data: {
                __schema: {
                  queryType: {
                    name: 'Query',
                  },
                },
              },
            },
            null,
            2
          )
        );
      } else {
        response.statusCode = 405;
        response.end();
      }
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditGetOrPostRequest({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetOrPostRequest-warn.json')
      );
    } finally {
      close();
    }
  });

  tests.add('`auditGetOrPostRequest` with status error.', async () => {
    const server = http.createServer(async (request, response) => {
      response.statusCode = 404;
      response.end();
    });

    const { port, close } = await listen(server);

    try {
      const result = await auditGetOrPostRequest({
        uri: `http://localhost:${port}`,
      });
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(__dirname, '../../snapshots/auditGetOrPostRequest-error.json')
      );
    } finally {
      close();
    }
  });
};
