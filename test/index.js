'use strict';

require('../private/nodeFetchPolyfill');
const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./cli/graphql-http-test.test')(tests);
require('./private/worstAuditResultStatus.test')(tests);
require('./private/audits/auditAcceptHeader.test')(tests);
require('./private/audits/auditNoAcceptHeader.test')(tests);
require('./private/audits/auditAcceptHeaderUnacceptable.test')(tests);
require('./private/audits/auditQuerySyntaxError.test')(tests);
require('./private/audits/auditGetRequests.test')(tests);
require('./private/audits/auditPostRequests.test')(tests);
require('./private/audits/auditGetOrPostRequest.test')(tests);
require('./public/graphqlHttpTest.test')(tests);
require('./public/reportAuditResults.test')(tests);

tests.run();
