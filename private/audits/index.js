'use strict';

const worstAuditResultStatus = require('../worstAuditResultStatus');
const auditGetOrPostRequest = require('./auditGetOrPostRequest');

/**
 * Audits the GraphQL server.
 * @kind function
 * @name audit
 * @param {object} context Audit context.
 * @param {string} context.uri URI to use for the request.
 * @returns {AuditResult} Audit result.
 * @ignore
 */
module.exports = async function audit(context) {
  const children = await Promise.all([auditGetOrPostRequest(context)]);
  return {
    description: 'Full compliance.',
    status: worstAuditResultStatus(children),
    children,
  };
};
