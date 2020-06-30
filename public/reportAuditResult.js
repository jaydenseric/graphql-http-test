'use strict';

const kleur = require('kleur');
const errorConsole = require('../private/errorConsole');

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
 * Reports the result of an audit in a human readable format either to `stderr`
 * if the root audit has an `error` status, or else to `stdout`. Only intended
 * for use in a Node.js environment.
 * @kind function
 * @name reportAuditResult
 * @param {AuditResult} auditResult An audit result.
 */
module.exports = function reportAuditResult(auditResult) {
  const reporter = auditResult.status === 'error' ? errorConsole : console;
  const recurse = ({ description, status, children }) => {
    reporter.groupCollapsed(
      kleur[STATUS_COLORS[status]](`${STATUS_SYMBOLS[status]} ${description}`)
    );
    if (children) children.forEach(recurse);
    reporter.groupEnd();
  };

  recurse(auditResult);
};
