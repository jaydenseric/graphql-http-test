'use strict';

const AUDIT_RESULT_STATUS_SEVERITY = {
  ok: 0,
  warn: 1,
  error: 2,
};

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
