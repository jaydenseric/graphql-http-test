/* eslint-env node, browser */

'use strict';

const auditPostRequest = require('./auditPostRequest');
const auditQuerySyntaxError = require('./auditQuerySyntaxError');

/**
 * Audits if the GraphQL server supports different types of POST requests.
 * @kind function
 * @name auditPostRequests
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function auditPostRequests(context) {
  const children = await Promise.all([
    auditPostRequest(context),
    auditQuerySyntaxError(context, 'POST'),
  ]);

  return {
    description: 'POST requests SHOULD be supported.',
    status: children.every(({ status }) => status === 'ok') ? 'ok' : 'warn',
    children,
  };
};
