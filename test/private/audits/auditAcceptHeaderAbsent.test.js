'use strict';

const { createServer } = require('http');
const { resolve } = require('path');
const snapshot = require('snapshot-assertion');
const auditAcceptHeaderAbsent = require('../../../private/audits/auditAcceptHeaderAbsent');
const listen = require('../../listen');
const testQueryData = require('../../testQueryData');

const serverOk = createServer(async (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/graphql+json' });
  response.end(JSON.stringify({ data: testQueryData }, null, 2));
});

const serverError = createServer(async (request, response) => {
  response.statusCode = 404;
  response.end();
});

module.exports = (tests) => {
  tests.add('`auditAcceptHeaderAbsent` with GET, status ok.', async () => {
    const { port, close } = await listen(serverOk);

    try {
      const result = await auditAcceptHeaderAbsent(
        { uri: `http://localhost:${port}` },
        'GET'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditAcceptHeaderAbsent-GET-ok.json'
        )
      );
    } finally {
      close();
    }
  });

  tests.add('`auditAcceptHeaderAbsent` with GET, status error.', async () => {
    const { port, close } = await listen(serverError);

    try {
      const result = await auditAcceptHeaderAbsent(
        { uri: `http://localhost:${port}` },
        'GET'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditAcceptHeaderAbsent-GET-error.json'
        )
      );
    } finally {
      close();
    }
  });

  tests.add('`auditAcceptHeaderAbsent` with POST, status ok.', async () => {
    const { port, close } = await listen(serverOk);

    try {
      const result = await auditAcceptHeaderAbsent(
        { uri: `http://localhost:${port}` },
        'POST'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditAcceptHeaderAbsent-POST-ok.json'
        )
      );
    } finally {
      close();
    }
  });

  tests.add('`auditAcceptHeaderAbsent` with POST, status error.', async () => {
    const { port, close } = await listen(serverError);

    try {
      const result = await auditAcceptHeaderAbsent(
        { uri: `http://localhost:${port}` },
        'POST'
      );
      await snapshot(
        JSON.stringify(result, null, 2),
        resolve(
          __dirname,
          '../../snapshots/auditAcceptHeaderAbsent-POST-error.json'
        )
      );
    } finally {
      close();
    }
  });
};
