/* eslint-env node, browser */

'use strict';

const isObject = require('isobject');
const testQuerySyntaxError = require('../testQuerySyntaxError');
const userAgent = require('../userAgent');

/**
 * Audits if the GraphQL server correctly handles a query with a syntax error.
 * @kind function
 * @name auditQuerySyntaxError
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @param {string} method HTTP method to use for the request; either `GET` or `POST`.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function auditQuerySyntaxError({ uri }, method) {
  let url = uri;

  const acceptContentType = 'application/graphql+json';
  const fetchOptions = {
    method,
    headers: {
      'User-Agent': userAgent,
      Accept: acceptContentType,
    },
  };

  switch (method) {
    case 'GET':
      url = new URL(uri);
      url.searchParams.append('query', testQuerySyntaxError);
      break;

    case 'POST':
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify({ query: testQuerySyntaxError });
      break;
  }

  const response = await fetch(url, fetchOptions);

  const children = [
    {
      description: 'Response HTTP status MUST be 400.',
      status: response.status === 400 ? 'ok' : 'error',
    },
    {
      description: `Response Content-Type header MUST match the request Accept header (${acceptContentType}).`,
      status:
        response.headers.get('Content-Type') === acceptContentType
          ? 'ok'
          : 'error',
    },
  ];

  try {
    var json = await response.json();
  } catch (error) {
    // Suppress an error.
  }

  children.push({
    description: 'Response body MUST contain appropriate data (JSON).',
    status:
      isObject(json) &&
      Array.isArray(json.errors) &&
      json.errors.length &&
      isObject(json.errors[0]) &&
      typeof json.errors[0].message === 'string'
        ? 'ok'
        : 'error',
  });

  return {
    description: 'Query with a syntax error.',
    status: children.every(({ status }) => status === 'ok') ? 'ok' : 'error',
    children,
  };
};
