'use strict'

/**
 * Records a Node.js child process.
 * @kind function
 * @name recordChildProcess
 * @param {ChildProcess} childProcess Node.js child process.
 * @returns {Promise<{output: Array<Array<string, string>>, exitCode: number, signal: string}>} Resolves a multidimensional array of output types (`stderr` or `stdout`) and values, the exit code if the child exited on its own, or the signal by which the child process was terminated.
 * @ignore
 */
module.exports = function recordChildProcess(childProcess) {
  return new Promise((resolve, reject) => {
    const output = []

    childProcess.stdout.on('data', data => {
      output.push(['stdout', data.toString()])
    })

    childProcess.stderr.on('data', data => {
      output.push(['stderr', data.toString()])
    })

    childProcess.once('error', reject)

    childProcess.once('close', (exitCode, signal) =>
      resolve({ output, exitCode, signal })
    )
  })
}
