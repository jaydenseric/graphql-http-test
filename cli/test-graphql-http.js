#!/usr/bin/env node

'use strict'

const errorConsole = require('../lib/errorConsole')
const testGraphqlHttp = require('../lib/testGraphqlHttp')

/**
 * Runs the test-graphql-http CLI.
 * @kind function
 * @name testGraphqlHttpCLI
 * @returns {Promise<void>} Resolves when all work is complete.
 * @ignore
 */
async function testGraphqlHttpCLI() {
  try {
    const [, , uri] = process.argv

    if (typeof uri !== 'string') throw new TypeError('Missing URI argument.')

    await testGraphqlHttp(uri)
  } catch (error) {
    errorConsole.group('test-graphql-https CLI error:')
    errorConsole.error(error)
    errorConsole.groupEnd()
    process.exitCode = 1
  }
}

testGraphqlHttpCLI()
