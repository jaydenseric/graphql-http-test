'use strict';

const reportAuditResults = require('../../public/reportAuditResult');

reportAuditResults({
  description: 'a',
  status: 'warn',
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
      status: 'ok',
      children: [
        {
          description: 'a.c.a',
          status: 'ok',
        },
      ],
    },
  ],
});
