'use strict';

const STATUS_SYMBOLS = {
  ok: '✓',
  warn: '⚠️',
  error: '✗',
};

module.exports = function reportAuditResult(auditResult) {
  const recurse = ({ description, status, children }) => {
    console.groupCollapsed(`${STATUS_SYMBOLS[status]} ${description}`);
    if (children) children.forEach(recurse);
    console.groupEnd();
  };

  recurse(auditResult);
};
