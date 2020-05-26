/* eslint-env node, browser */

'use strict';

const isObject = require('isobject');
const userAgent = require('../userAgent');
const worstAuditResultStatus = require('../worstAuditResultStatus');

module.exports = async function auditPostRequest({ uri }) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'User-Agent': userAgent,
      'Content-Type': 'application/json',
      Accept: 'application/graphql+json',
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        {
          __schema {
            queryType {
              name
            }
          }
        }
      `,
    }),
  });

  const children = [
    {
      description: 'Server returns a 200 HTTP response.',
      status: response.status === 200 ? 'ok' : 'warn',
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
    description: 'Response body SHOULD contain JSON appropriate for the query.',
    status:
      isObject(json) &&
      isObject(json.data) &&
      isObject(json.data.__schema) &&
      isObject(json.data.__schema.queryType) &&
      json.data.__schema.queryType.name === 'Query'
        ? 'ok'
        : 'warn',
  });

  return {
    description: 'A POST method SHOULD be successful.',
    status: worstAuditResultStatus(children),
    children,
  };
};
