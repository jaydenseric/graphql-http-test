'use strict';

const pkg = require('../package.json');

/**
 * The user agent string to be used for all requests to servers being tested, to
 * help identify the source of accidental API abuse.
 * @kind constant
 * @name userAgent
 * @type {string}
 * @see [jaydenseric/graphql-http-test#2](https://github.com/jaydenseric/graphql-http-test/issues/2).
 * @ignore
 */
module.exports = `${pkg.name}/${pkg.version} (+${pkg.homepage})`;
