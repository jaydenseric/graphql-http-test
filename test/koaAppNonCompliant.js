'use strict';

const { errorHandler } = require('graphql-api-koa');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

module.exports = new Koa().use(errorHandler()).use(bodyParser());
