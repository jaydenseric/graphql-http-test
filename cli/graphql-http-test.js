#!/usr/bin/env node

'use strict';

require('../private/nodeFetchPolyfill');
const kleur = require('kleur');
const CliError = require('../private/CliError');
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
    if (typeof uri !== 'string') throw new CliError('Missing URI argument.');
    const auditResults = await graphqlHttpTest(uri);
    reportAuditResult(auditResults);
    if (auditResults.status === 'error') process.exitCode = 1;
  } catch (error) {
    errorConsole.group(
      kleur.bold().red('\nError running graphql-http-test:\n')
    );
    errorConsole.error(
      error instanceof CliError ? kleur.red(error.message) : error,
      '\n'
    );
    errorConsole.groupEnd();
    process.exitCode = 1;
  }
}

testGraphqlHttpCLI();
