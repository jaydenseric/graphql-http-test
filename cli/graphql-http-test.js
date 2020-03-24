#!/usr/bin/env node

'use strict'

const errorConsole = require('../lib/errorConsole')
const graphqlHttpTest = require('../lib/graphqlHttpTest')

/**
 * Runs the graphql-http-test CLI.
 * @kind function
 * @name testGraphqlHttpCLI
 * @returns {Promise<void>} Resolves when all work is complete.
 * @ignore
 */
async function testGraphqlHttpCLI() {
  try {
    const [, , uri] = process.argv

    if (typeof uri !== 'string') throw new TypeError('Missing URI argument.')

    await graphqlHttpTest(uri)
  } catch (error) {
    errorConsole.group('graphql-http-test CLI error:')
    errorConsole.error(error)
    errorConsole.groupEnd()
    process.exitCode = 1
  }
}

testGraphqlHttpCLI()
