'use strict';

const worstAuditResultStatus = require('../worstAuditResultStatus');
const auditPostRequest = require('./auditPostRequest');

module.exports = async function audit(context) {
  const children = [await auditPostRequest(context)];
  return {
    description: 'Full compliance.',
    status: worstAuditResultStatus(children),
    children,
  };
};
