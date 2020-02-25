'use strict'

const {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql')

/**
 * The test GraphQL schema that a GraphQL server should implement for testing
 * with [`testGraphqlHttp`]{@link testGraphqlHttp}.
 * @kind constant
 * @name schema
 * @type {GraphQLSchema}
 */
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ok: {
        description: 'A field that resolves ok.',
        type: GraphQLNonNull(GraphQLBoolean),
        resolve: () => true
      },
      error: {
        description: 'A field that resolves an error.',
        type: GraphQLNonNull(GraphQLBoolean),
        resolve() {
          throw new Error('A resolver error.')
        }
      }
    })
  })
})
