'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./cli/graphql-http-test.test')(tests);
require('./public/graphqlHttpTest.test')(tests);

tests.run();
