'use strict';

const audit = require('../private/audits');

/**
 * Audits that a GraphQL server at a given URI is [GraphQL over HTTP spec](https://github.com/graphql/graphql-over-http)
 * compliant.
 * @kind function
 * @name graphqlHttpTest
 * @param {string} uri GraphQL server URI.
 * @returns {Promise<AuditResult>} Resolves once tests are complete.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { graphqlHttpTest } from 'graphql-http-test';
 * ```
 *
 * ```js
 * import graphqlHttpTest from 'graphql-http-test/public/graphqlHttpTest.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { graphqlHttpTest } = require('graphql-http-test');
 * ```
 *
 * ```js
 * const graphqlHttpTest = require('graphql-http-test/public/graphqlHttpTest');
 * ```
 */
module.exports = async function graphqlHttpTest(uri) {
  if (typeof uri !== 'string')
    throw new TypeError('The first `uri` parameter must be a string.');

  return audit({ uri });
};
