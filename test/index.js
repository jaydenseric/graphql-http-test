'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./lib/graphqlHttpTest.test')(tests);
require('./cli/graphql-http-test.test')(tests);

tests.run();
