'use strict'

/**
 * Records a Node.js child process.
 * @kind function
 * @name recordChildProcess
 * @param {ChildProcess} childProcess Node.js child process.
 * @returns {Promise<{output: {stdout: string, stderr: string}, exitCode: number, signal: string}>} Resolves a multidimensional array of output types (`stderr` or `stdout`) and values, the exit code if the child exited on its own, or the signal by which the child process was terminated.
 * @ignore
 */
module.exports = function recordChildProcess(childProcess) {
  return new Promise((resolve, reject) => {
    const output = {
      stdout: '',
      stderr: '',
    }

    const add = (pipe, data) => {
      const text = data.toString()
      output[pipe] += text
    }

    childProcess.stdout.on('data', (data) => {
      add('stdout', data)
    })

    childProcess.stderr.on('data', (data) => {
      add('stderr', data)
    })

    childProcess.once('error', reject)

    childProcess.once('close', (exitCode, signal) =>
      resolve({ output, exitCode, signal })
    )
  })
}
