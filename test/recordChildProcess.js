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

    const add = (pipe, data) => {
      const lastOutput = output[output.length - 1]
      const text = data.toString()
      if (lastOutput && lastOutput[0] === pipe)
        // If the data came through the same pipe as the last data, concatenate
        lastOutput[1] += text
      else output.push([pipe, text])
    }

    childProcess.stdout.on('data', data => {
      add('stdout', data)
    })

    childProcess.stderr.on('data', data => {
      add('stderr', data)
    })

    childProcess.once('error', reject)

    childProcess.once('close', (exitCode, signal) =>
      resolve({ output, exitCode, signal })
    )
  })
}
