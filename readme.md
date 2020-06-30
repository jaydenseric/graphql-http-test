# graphql-http-test

[![npm version](https://badgen.net/npm/v/graphql-http-test)](https://npm.im/graphql-http-test) [![CI status](https://github.com/jaydenseric/graphql-http-test/workflows/CI/badge.svg)](https://github.com/jaydenseric/graphql-http-test/actions)

A JavaScript API and CLI to test a GraphQL server for [GraphQL HTTP spec](https://github.com/APIs-guru/graphql-over-http) compliance.

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install graphql-http-test --save-dev
```

Then create and run a GraphQL server that implements the [test schema](#constant-schema).

Finally use either the function [`graphqlHttpTest`](#function-testgraphqlhttp) or the [CLI](#cli) with the GraphQL server URI to run the tests.

## Support

- Linux, macOS.
- Node.js `^10.17.0 || ^12.0.0 || >= 13.7.0`.

## CLI

The `graphql-http-test` command tests that a GraphQL server at a given URI implements the [test schema](#constant-schema) and complies with the GraphQL HTTP spec. It outputs test results to `stdout` and `stderror` accordingly, and exits with status `1` if tests failed.

It implements the function [`graphqlHttpTest`](#function-testgraphqlhttp) and has one argument; the GraphQL server URI.

[npx](https://npm.im/npx) example:

```sh
npx graphql-http-test http://localhost:3001/graphql
```

## API

### Table of contents

- [function graphqlHttpTest](#function-graphqlhttptest)
- [type AuditResult](#type-auditresult)
- [type AuditResultStatus](#type-auditresultstatus)

### function graphqlHttpTest

Audits that a GraphQL server at a given URI complies with the [GraphQL HTTP spec](https://github.com/APIs-guru/graphql-over-http).

| Parameter | Type   | Description         |
| :-------- | :----- | :------------------ |
| `uri`     | string | GraphQL server URI. |

**Returns:** Promise&lt;[AuditResult](#type-auditresult)> — Resolves once tests are complete.

#### Examples

_Ways to `import`._

> ```js
> import { graphqlHttpTest } from 'graphql-http-test';
> ```
>
> ```js
> import graphqlHttpTest from 'graphql-http-test/public/graphqlHttpTest.js';
> ```

_Ways to `require`._

> ```js
> const { graphqlHttpTest } = require('graphql-http-test');
> ```
>
> ```js
> const graphqlHttpTest = require('graphql-http-test/public/graphqlHttpTest');
> ```

---

### type AuditResult

An audit result.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `description` | string | Audit description. |
| `status` | [AuditResultStatus](#type-auditresultstatus) | Audit result status. |
| `children` | [AuditResult](#type-auditresult)? | Child audit results. |

---

### type AuditResultStatus

An audit result status.

**Type:** `ok` | `warn` | `error`
