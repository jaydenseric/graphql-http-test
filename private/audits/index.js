'use strict';

const worstAuditResultStatus = require('../worstAuditResultStatus');
const auditGetOrPostRequest = require('./auditGetOrPostRequest');

module.exports = async function audit(context) {
  const children = await Promise.all([auditGetOrPostRequest(context)]);
  return {
    description: 'Full compliance.',
    status: worstAuditResultStatus(children),
    children,
  };
};
