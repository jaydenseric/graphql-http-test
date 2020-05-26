'use strict';

const {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

/**
 * The test GraphQL schema that a GraphQL server should implement for testing
 * with [`graphqlHttpTest`]{@link graphqlHttpTest}.
 * @kind constant
 * @name schema
 * @type {GraphQLSchema}
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { schema } from 'graphql-http-test';
 * ```
 *
 * ```js
 * import schema from 'graphql-http-test/public/schema.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { schema } = require('graphql-http-test');
 * ```
 *
 * ```js
 * const schema = require('graphql-http-test/public/schema');
 * ```
 */
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ok: {
        description: 'A field that resolves ok.',
        type: GraphQLNonNull(GraphQLBoolean),
        resolve: () => true,
      },
      error: {
        description: 'A field that resolves an error.',
        type: GraphQLNonNull(GraphQLBoolean),
        resolve() {
          throw new Error('A resolver error.');
        },
      },
    }),
  }),
});
