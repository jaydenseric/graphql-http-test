'use strict';

/**
 * A child process recording.
 * @kind typedef
 * @name ChildProcessRecording
 * @type {object}
 * @prop {string} stdout The child process `stdout`.
 * @prop {string} stderr The child process `stderr`.
 * @prop {number} [exitCode] The child process exit code if it exited on its own.
 * @prop {string} [signal] The signal by which the child process was terminated if it didn’t exit on its own.
 * @ignore
 */

/**
 * Records a Node.js child process.
 * @kind function
 * @name recordChildProcess
 * @param {ChildProcess} childProcess Node.js child process.
 * @returns {Promise<ChildProcessRecording>} Resolves the recording of the child process.
 * @ignore
 */
module.exports = function recordChildProcess(childProcess) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    childProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    childProcess.once('error', reject);

    childProcess.once('close', (exitCode, signal) =>
      resolve({ stdout, stderr, exitCode, signal })
    );
  });
};
