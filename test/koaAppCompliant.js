'use strict';

const { errorHandler, execute } = require('graphql-api-koa');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const schema = require('../lib/schema');

module.exports = new Koa()
  .use(errorHandler())
  .use(bodyParser())
  .use(execute({ schema }));
