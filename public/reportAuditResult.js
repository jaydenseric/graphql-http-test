'use strict';

const kleur = require('kleur');

const STATUS_SYMBOLS = {
  ok: '✓',
  warn: '⚠️',
  error: '✗',
};

const STATUS_COLORS = {
  ok: 'green',
  warn: 'yellow',
  error: 'red',
};

/**
 * Reports the result of an audit to the console. Intended for use in a server
 * environment.
 * @kind function
 * @name reportAuditResult
 * @param {AuditResult} auditResult An audit result.
 */
module.exports = function reportAuditResult(auditResult) {
  const recurse = ({ description, status, children }) => {
    console.groupCollapsed(
      kleur[STATUS_COLORS[status]](`${STATUS_SYMBOLS[status]} ${description}`)
    );
    if (children) children.forEach(recurse);
    console.groupEnd();
  };

  recurse(auditResult);
};
