'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const getRawBody = require('raw-body');
const snapshot = require('snapshot-assertion');
const auditGetOrPostRequest = require('../../../private/audits/auditGetOrPostRequest');
const listen = require('../../listen');
const testQueryData = require('../../testQueryData');

module.exports = (tests) => {
  tests.add('`auditGetOrPostRequest` with status ok.', async () => {
    const server = createServer(async (request, response) => {
      let query;

      if (request.method === 'GET')
        query = new URL(
          request.url,
          `http://${request.headers.host}`
        ).searchParams.get('query');
      else {
        const body = await getRawBody(request);
        ({ query } = JSON.parse(body));
      }

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
    const server = createServer(async (request, response) => {
      if (request.method === 'POST') {
        const body = await getRawBody(request);
        const { query } = JSON.parse(body);

        if (query === '{}') {
          response.writeHead(400, {
            'Content-Type': 'application/graphql+json',
          });
          response.end(
            JSON.stringify(
              { errors: [{ message: 'Query syntax error.' }] },
              null,
              2
            )
          );
        } else {
          response.writeHead(200, {
            'Content-Type': 'application/graphql+json',
          });
          response.end(JSON.stringify({ data: testQueryData }, null, 2));
        }
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
    const server = createServer(async (request, response) => {
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
