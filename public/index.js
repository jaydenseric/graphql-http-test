'use strict';

exports.graphqlHttpTest = require('./graphqlHttpTest');
exports.reportAuditResult = require('./reportAuditResult');

/**
 * An audit result.
 * @kind typedef
 * @name AuditResult
 * @type {object}
 * @prop {string} description Audit description.
 * @prop {AuditResultStatus} status Audit result status.
 * @prop {Array<AuditResult>} [children] Child audit results.
 */

/**
 * An audit result status.
 * @kind typedef
 * @name AuditResultStatus
 * @type {'ok'|'warn'|'error'}
 */
