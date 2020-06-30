/* eslint-env node, browser */

'use strict';

const auditGetRequest = require('./auditGetRequest');
const auditPostRequest = require('./auditPostRequest');

module.exports = async function auditGetOrPostRequest(context) {
  const children = await Promise.all([
    auditGetRequest(context),
    auditPostRequest(context),
  ]);

  const okCount = children.reduce(
    (count, { status }) => (status === 'ok' ? count + 1 : count),
    0
  );

  return {
    description: 'Either a POST or a GET method MUST be successful.',
    status: okCount === children.length ? 'ok' : okCount ? 'warn' : 'error',
    children,
  };
};
