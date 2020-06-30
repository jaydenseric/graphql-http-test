# graphql-http-test changelog

## Next

### Major

- Updated Node.js support to `^10.17.0 || ^12.0.0 || >= 13.7.0`.
- Added a [package `exports` field](https://nodejs.org/api/esm.html#esm_package_entry_points) with [conditional exports](https://nodejs.org/api/esm.html#esm_conditional_exports) to support native ESM in Node.js and keep internal code private, [whilst avoiding the dual package hazard](https://nodejs.org/api/esm.html#esm_approach_1_use_an_es_module_wrapper). Published files have been reorganized, so previously undocumented deep imports will need to be rewritten according to the newly documented paths.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.

### Minor

- Display CLI errors with color, and without stack traces for expected user errors.

### Patch

- Updated the [`graphql`](https://npm.im/graphql) peer dependency to `0.13.1 - 15`.
- Updated Prettier related package scripts.
- Configured Prettier option `semi` to the default, `true`.
- Stop testing Node.js v13, start testing Node.js v14.
- Added an npm version readme badge.
- Updated the EditorConfig URL.
- Restructured test files.
- Removed the `recordChildProcess` test by using the Node.js `child_process.spawnSync` API.
- Snapshot `stdout` and `stderr` as `.txt` instead of `.json`.
- Assert exit code after `stdout` and `stderr` for easier test failure diagnosis.

## 1.0.0-alpha.1

Initial release.
