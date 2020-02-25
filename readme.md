# test-graphql-http

[![CI status](https://github.com/jaydenseric/test-graphql-http/workflows/CI/badge.svg)](https://github.com/jaydenseric/test-graphql-http/actions)

A JavaScript API and CLI to test a GraphQL server for [GraphQL HTTP spec](https://github.com/APIs-guru/graphql-over-http) compliance.

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install test-graphql-http --save-dev
```

Then create and run a GraphQL server that implements the [test schema](#constant-schema).

Finally use either the function [`testGraphqlHttp`](#function-testgraphqlhttp) or the [CLI](#cli) with the GraphQL server URI to run the tests.

## Support

- Linux, macOS.
- Node.js v10+.

## CLI

The `test-graphql-http` command tests that a GraphQL server at a given URI implements the [test schema](#constant-schema) and complies with the GraphQL HTTP spec. It outputs test results to `stdout` and `stderror` accordingly, and exits with status `1` if tests failed.

It implements the function [`testGraphqlHttp`](#function-testgraphqlhttp) and has one argument; the GraphQL server URI.

[npx](https://npm.im/npx) example:

```sh
npx test-graphql-http http://localhost:3001/graphql
```

## API

### Table of contents

- [function testGraphqlHttp](#function-testgraphqlhttp)
- [constant schema](#constant-schema)

### function testGraphqlHttp

Tests that a GraphQL server at a given URI implements the [test schema](#constant-schema) and complies with the GraphQL HTTP spec. It outputs test results to the console, and if tests failed sets the `process.exitCode` to `1`, optionally throwing an error.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `uri` | string | GraphQL server URI. |
| `throwOnFailure` | boolean? | After tests run, should an error be thrown if some failed. |

**Returns:** Promise&lt;void> — Resolves once tests are complete.

#### Examples

_How to import._

> ```js
> const { testGraphqlHttp } = require('test-graphql-http')
> ```

---

### constant schema

The test GraphQL schema that a GraphQL server should implement for testing with [`testGraphqlHttp`](#function-testgraphqlhttp).

**Type:** GraphQLSchema

#### Examples

_How to import._

> ```js
> const { schema } = require('test-graphql-http')
> ```
