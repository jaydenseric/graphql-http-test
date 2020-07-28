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

const STATUS_SUMMARIES = {
  ok: 'compliant',
  warn: 'compliant with warnings',
  error: 'non-compliant',
};

/**
 * Reports the result of an audit in a human readable format either to `stderr`
 * if the root audit has an `error` status, or else to `stdout`. Only intended
 * for use in a Node.js environment.
 * @kind function
 * @name reportAuditResult
 * @param {AuditResult} auditResult An audit result.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { reportAuditResult } from 'graphql-http-test';
 * ```
 *
 * ```js
 * import reportAuditResult from 'graphql-http-test/public/reportAuditResult.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { reportAuditResult } = require('graphql-http-test');
 * ```
 *
 * ```js
 * const reportAuditResult = require('graphql-http-test/public/reportAuditResult');
 * ```
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

  reporter.info(
    kleur
      .bold()
      [STATUS_COLORS[auditResult.status]](
        `\nEndpoint is ${STATUS_SUMMARIES[auditResult.status]}.\n`
      )
  );
};
