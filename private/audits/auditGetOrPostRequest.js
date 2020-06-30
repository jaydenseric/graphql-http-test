'use strict';

const auditGetRequests = require('./auditGetRequests');
const auditPostRequests = require('./auditPostRequests');

/**
 * Audits if the GraphQL server correctly handles either a GET or POST request.
 * @kind function
 * @name auditGetOrPostRequest
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function auditGetOrPostRequest(context) {
  const children = await Promise.all([
    auditGetRequests(context),
    auditPostRequests(context),
  ]);

  const okCount = children.reduce(
    (count, { status }) => (status === 'ok' ? count + 1 : count),
    0
  );

  return {
    description: 'GET or POST requests MUST be supported.',
    status: okCount === children.length ? 'ok' : okCount ? 'warn' : 'error',
    children,
  };
};
