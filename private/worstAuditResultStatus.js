'use strict';

const AUDIT_RESULT_STATUS_SEVERITY = {
  ok: 0,
  warn: 1,
  error: 2,
};

/**
 * Gets the worst audit result status in a list of audit results.
 * @kind function
 * @name worstAuditResultStatus
 * @param {Array<AuditResult>} auditResults Audit results.
 * @returns {AuditResultStatus} Worst audit result status.
 * @ignore
 */
module.exports = function worstAuditResultStatus(auditResults) {
  return auditResults.reduce(
    (status, result) =>
      AUDIT_RESULT_STATUS_SEVERITY[status] <
      AUDIT_RESULT_STATUS_SEVERITY[result.status]
        ? result.status
        : status,
    'ok'
  );
};
