'use strict';

const reportAuditResults = require('../../public/reportAuditResult');

reportAuditResults({
  description: 'a',
  status: 'ok',
  children: [
    {
      description: 'a.a',
      status: 'ok',
    },
    {
      description: 'a.b',
      status: 'ok',
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
