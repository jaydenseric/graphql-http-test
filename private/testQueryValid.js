'use strict';

/**
 * A test GraphQL query with valid syntax.
 * @kind constant
 * @name testQueryValid
 * @type {string}
 * @ignore
 */
module.exports = /* GraphQL */ `
  {
    __schema {
      queryType {
        name
      }
    }
  }
`;
