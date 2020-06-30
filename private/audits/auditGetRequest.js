/* eslint-env node, browser */

'use strict';

const isObject = require('isobject');
const userAgent = require('../userAgent');

module.exports = async function auditGetRequest({ uri }) {
  const url = new URL(uri);

  url.searchParams.append(
    'query',
    /* GraphQL */ `
      {
        __schema {
          queryType {
            name
          }
        }
      }
    `
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      'Content-Type': 'application/graphql+json',
      Accept: 'application/graphql+json',
    },
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
    description: 'Response body MUST contain JSON appropriate for the query.',
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
    description: 'A GET method SHOULD be successful.',
    status: children.every(({ status }) => status === 'ok') ? 'ok' : 'warn',
    children,
  };
};
