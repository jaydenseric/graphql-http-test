'use strict';

const { deepStrictEqual, strictEqual } = require('assert');
const isObject = require('isobject');
const fetch = require('node-fetch');
const { TestDirector } = require('test-director');
const pkg = require('../package.json');

/**
 * The user agent string to be used for all requests to servers being tested, to
 * help identify the source of accidental API abuse.
 * @kind constant
 * @name USER_AGENT
 * @type {string}
 * @see [jaydenseric/graphql-http-test#2](https://github.com/jaydenseric/graphql-http-test/issues/2).
 * @ignore
 */
const USER_AGENT = `${pkg.name}/${pkg.version} (+${pkg.homepage})`;

/**
 * Tests that a GraphQL server at a given URI implements the
 * [test schema]{@link schema} and complies with the GraphQL HTTP spec.
 * It outputs test results to the console, and if tests failed sets the
 * `process.exitCode` to `1`, optionally throwing an error.
 * @kind function
 * @name graphqlHttpTest
 * @param {string} uri GraphQL server URI.
 * @param {boolean} [throwOnFailure] After tests run, should an error be thrown if some failed.
 * @returns {Promise<void>} Resolves once tests are complete.
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
module.exports = async function graphqlHttpTest(uri, throwOnFailure) {
  if (typeof uri !== 'string')
    throw new TypeError('The first `uri` parameter must be a string.');

  const tests = new TestDirector();

  tests.add('Query a field that resolves ok.', async () => {
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: '{ ok }' }),
    });

    strictEqual(response.status, 200);
    deepStrictEqual(await response.json(), { data: { ok: true } });
  });

  tests.add('Query a field that resolves an error.', async () => {
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: '{ error }' }),
    });
    const json = await response.json();

    strictEqual(response.status, 200);
    strictEqual(isObject(json), true);
    strictEqual('data' in json, false);
    strictEqual(Array.isArray(json.errors), true);
    strictEqual(json.errors.length, 1);
    strictEqual(isObject(json.errors[0]), true);
    deepStrictEqual(json.errors[0].locations, [{ column: 3, line: 1 }]);

    // Don’t test the error message content, as it may be obfuscated to prevent
    // server errors being exposed to the client.
    strictEqual(typeof json.errors[0].message === 'string', true);

    deepStrictEqual(json.errors[0].path, ['error']);
  });

  await tests.run(throwOnFailure);
};
