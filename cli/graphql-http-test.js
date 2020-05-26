#!/usr/bin/env node

'use strict';

require('../private/nodeFetchPolyfill');
const errorConsole = require('../private/errorConsole');
const graphqlHttpTest = require('../public/graphqlHttpTest');
const reportAuditResult = require('../public/reportAuditResult');

/**
 * Runs the graphql-http-test CLI.
 * @kind function
 * @name testGraphqlHttpCLI
 * @returns {Promise<void>} Resolves when all work is complete.
 * @ignore
 */
async function testGraphqlHttpCLI() {
  try {
    const [, , uri] = process.argv;
    if (typeof uri !== 'string') throw new TypeError('Missing URI argument.');
    const auditResults = await graphqlHttpTest(uri);
    reportAuditResult(auditResults);
    if (auditResults.status === 'error') process.exitCode = 1;
  } catch (error) {
    errorConsole.group('graphql-http-test CLI error:');
    errorConsole.error(error);
    errorConsole.groupEnd();
    process.exitCode = 1;
  }
}

testGraphqlHttpCLI();
