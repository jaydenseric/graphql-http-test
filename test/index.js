'use strict'

const { strictEqual, rejects } = require('assert')
const { spawn } = require('child_process')
const { resolve } = require('path')
const { errorHandler, execute } = require('graphql-api-koa')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const snapshot = require('snapshot-assertion')
const { TestDirector } = require('test-director')
const schema = require('../lib/schema')
const testGraphqlHttp = require('../lib/testGraphqlHttp')
const nodeMajorVersion = require('./nodeMajorVersion')
const recordChildProcess = require('./recordChildProcess')
const startServer = require('./startServer')
const stripStackTraces = require('./stripStackTraces')

const cliPath = resolve(__dirname, '../cli/test-graphql-http')

const compliantKoaApp = new Koa()
  .use(errorHandler())
  .use(bodyParser())
  .use(execute({ schema }))

const noncompliantKoaApp = new Koa().use(errorHandler()).use(bodyParser())

const tests = new TestDirector()

tests.add('`testGraphqlHttp` without the URI parameter.', async () => {
  await rejects(
    testGraphqlHttp(),
    new TypeError('The first `uri` parameter must be a string.')
  )
})

tests.add('`test-graphql-http` CLI without the URI argument.', async () => {
  const { output, exitCode } = await recordChildProcess(
    spawn('node', [cliPath])
  )

  strictEqual(exitCode, 1)

  await snapshot(
    JSON.stringify(
      {
        stdout: stripStackTraces(output.stdout),
        stderr: stripStackTraces(output.stderr),
      },
      null,
      2
    ),
    resolve(__dirname, 'snapshots', 'cli-output-without-uri-arg.json')
  )
})

tests.add('`test-graphql-http` CLI with a compliant server.', async () => {
  const { port, close } = await startServer(compliantKoaApp)

  try {
    const { output, exitCode } = await recordChildProcess(
      spawn('node', [cliPath, `http://localhost:${port}`])
    )

    strictEqual(exitCode, 0)

    await snapshot(
      JSON.stringify(output, null, 2),
      resolve(__dirname, 'snapshots', 'cli-output-compliant.json')
    )
  } finally {
    close()
  }
})

tests.add('`test-graphql-http` CLI with a noncompliant server.', async () => {
  const { port, close } = await startServer(noncompliantKoaApp)

  try {
    const uri = `http://localhost:${port}`
    const { output, exitCode } = await recordChildProcess(
      spawn('node', [cliPath, uri])
    )

    strictEqual(exitCode, 1)

    await snapshot(
      JSON.stringify(
        {
          stdout: output.stdout.replace(uri, '<uri>'),
          stderr: output.stderr.replace(uri, '<uri>'),
        },
        null,
        2
      ),
      resolve(
        __dirname,
        'snapshots',
        `cli-output-noncompliant-node-v${nodeMajorVersion}.json`
      )
    )
  } finally {
    close()
  }
})

tests.run()
