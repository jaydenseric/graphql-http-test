/* eslint-env node, browser */

'use strict';

const isObject = require('isobject');
const testAcceptHeaderUnacceptable = require('../testAcceptHeaderUnacceptable');
const testQueryValid = require('../testQueryValid');
const userAgent = require('../userAgent');

/**
 * Audits if the GraphQL server correctly handles a query request with an
 * unacceptable `Accept` header.
 * @kind function
 * @name auditAcceptHeaderUnacceptable
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @param {string} method HTTP method to use for the request; either `GET` or `POST`.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function auditAcceptHeaderUnacceptable({ uri }, method) {
  let url = uri;

  const fetchOptions = {
    method,
    headers: {
      'User-Agent': userAgent,
      Accept: testAcceptHeaderUnacceptable,
    },
  };

  switch (method) {
    case 'GET':
      url = new URL(uri);
      url.searchParams.append('query', testQueryValid);
      break;

    case 'POST':
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify({ query: testQueryValid });
      break;
  }

  const response = await fetch(url, fetchOptions);

  const children = [
    {
      description: 'Response HTTP status MUST be 406.',
      status: response.status === 406 ? 'ok' : 'error',
    },
    {
      description: `Response Content-Type header MUST be application/graphql+json.`,
      status:
        response.headers.get('Content-Type') === 'application/graphql+json'
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
    description: 'Query request with an unacceptable Accept header.',
    status: children.every(({ status }) => status === 'ok') ? 'ok' : 'error',
    children,
  };
};
