'use strict';

const { strictEqual } = require('assert');
const worstAuditResultStatus = require('../../private/worstAuditResultStatus');

module.exports = (tests) => {
  tests.add('`worstAuditResultStatus`.', async () => {
    strictEqual(worstAuditResultStatus([{ status: 'ok' }]), 'ok');
    strictEqual(
      worstAuditResultStatus([{ status: 'ok' }, { status: 'warn' }]),
      'warn'
    );
    strictEqual(
      worstAuditResultStatus([
        { status: 'ok' },
        { status: 'error' },
        { status: 'warn' },
      ]),
      'error'
    );
  });
};
