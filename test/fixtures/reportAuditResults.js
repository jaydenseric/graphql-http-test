'use strict';

const reportAuditResults = require('../../public/reportAuditResult');

reportAuditResults({
  description: 'a',
  status: 'error',
  children: [
    {
      description: 'a.a',
      status: 'ok',
    },
    {
      description: 'a.b',
      status: 'warn',
    },
    {
      description: 'a.c',
      status: 'error',
      children: [
        {
          description: 'a.c.a',
          status: 'error',
        },
      ],
    },
  ],
});
