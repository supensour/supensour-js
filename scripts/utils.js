const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const spinner = require('ora')()
const emptyAnonymousFunction = () => undefined

function cleanDirectory (dir) {
  fs.removeSync(dir, {
    force: true,
    recursive: true
  })
}

function createArrays (size, start = 0) {
  const indices = []
  for (let i = 0; i < size; i++) {
    indices.push(i + start)
  }
  return indices
}

const executePipelineDefaultOpts = () => ({
  ignoreError: false
})
function executePipeline (action, message, options = executePipelineDefaultOpts()) {
  const pipeline = []

  function execute () {
    const digitCount = `${pipeline.length}`.length
    for (let i = 0; i < pipeline.length; i++) {
      const process = pipeline[i]
      const msg = `${i + 1}`.padStart(digitCount, ' ') + `. ${process.message}`
      try {
        spinner.start(msg).stopAndPersist({ symbol: '⌛' })
        const output = process.action()
        spinner.succeed(msg)
        output && log.info(output)
      } catch (e) {
        spinner.fail(msg)
        if (!process.options.ignoreError) {
          throw e
        }
      }
    }
  }

  function addProcess (action, message, options) {
    options = typeof options === 'object' ? options : {}
    pipeline.push({ action, message, options })
    return {
      pipe: addProcess,
      execute
    }
  }
  return addProcess(action, message, options)
}

const log = {
  info (...msg) {
    console.info(chalk(...msg))
  },
  warn (...msg) {
    console.error(chalk.keyword('orange')(...msg))
  },
  error (...msg) {
    console.warn(chalk.red(...msg))
  }
}

function loop (count, action) {
  return createArrays(isNaN(count) ? 0 : count)
    .map(typeof action === 'function' ? action : emptyAnonymousFunction)
}

function repeatAndJoinString (count, string) {
  return loop(count, () => string).join('')
}

function resolvePath (...pathParts) {
  return path.resolve(__dirname, '..', ...pathParts)
}

module.exports = {
  cleanDirectory,
  createArrays,
  executePipeline,
  log,
  loop,
  repeatAndJoinString,
  resolvePath
}
