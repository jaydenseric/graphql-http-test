'use strict';

const { rejects } = require('assert');
const graphqlHttpTest = require('../../lib/graphqlHttpTest');

module.exports = (tests) => {
  tests.add('`graphqlHttpTest` without the URI parameter.', async () => {
    await rejects(
      graphqlHttpTest(),
      new TypeError('The first `uri` parameter must be a string.')
    );
  });
};
