'use strict';

require('../private/nodeFetchPolyfill');
const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./cli/graphql-http-test.test')(tests);
require('./private/audits/auditPostRequest.test')(tests);
require('./private/reportAuditResults.test')(tests);
require('./private/worstAuditResultStatus.test')(tests);
require('./public/graphqlHttpTest.test')(tests);

tests.run();
