/* eslint-env node, browser */

'use strict';

const isObject = require('isobject');
const testQuery = require('../testQuery');
const userAgent = require('../userAgent');

/**
 * Audits if the GraphQL server correctly handles a POST request.
 * @kind function
 * @name auditPostRequest
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function auditPostRequest({ uri }) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'User-Agent': userAgent,
      'Content-Type': 'application/json',
      Accept: 'application/graphql+json',
    },
    body: JSON.stringify({ query: testQuery }),
  });

  const children = [
    {
      description: 'Response HTTP status MUST be 200.',
      status: response.status === 200 ? 'ok' : 'error',
    },
  ];

  try {
    var json = await response.json();
  } catch (error) {
    // Suppress an error.
  }

  // Expected JSON (additional fields allowed):
  // {
  //   "data": {
  //     "__schema": {
  //       "queryType": {
  //         "name": "Query"
  //       }
  //     }
  //   }
  // }

  children.push({
    description: 'Response body MUST contain appropriate JSON.',
    status:
      isObject(json) &&
      isObject(json.data) &&
      isObject(json.data.__schema) &&
      isObject(json.data.__schema.queryType) &&
      json.data.__schema.queryType.name === 'Query'
        ? 'ok'
        : 'error',
  });

  return {
    description: 'A correct POST request MUST have a correct response.',
    status: children.every(({ status }) => status === 'ok') ? 'ok' : 'error',
    children,
  };
};
