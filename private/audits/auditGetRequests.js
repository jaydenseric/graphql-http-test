/* eslint-env node, browser */

'use strict';

const auditGetRequest = require('./auditGetRequest');
const auditQuerySyntaxError = require('./auditQuerySyntaxError');

/**
 * Audits if the GraphQL server supports different types of GET requests.
 * @kind function
 * @name auditGetRequests
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function auditGetRequests(context) {
  const children = await Promise.all([
    auditGetRequest(context),
    auditQuerySyntaxError(context, 'GET'),
  ]);

  return {
    description: 'GET requests SHOULD be supported.',
    status: children.every(({ status }) => status === 'ok') ? 'ok' : 'warn',
    children,
  };
};
