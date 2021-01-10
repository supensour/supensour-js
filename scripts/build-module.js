const chalk = require('chalk')
const { execSync } = require('child_process')
const { cleanDirectory, executePipeline, resolvePath } = require('./utils')

console.log(chalk.cyan('### Build module'))

const dir = resolvePath('dist')

function transpile () {
  const childProcess = execSync('tsc', { stdio: 'inherit' })
  if (childProcess && childProcess.error) {
    throw childProcess.error
  }
  return childProcess instanceof Buffer ? childProcess.toString() : childProcess
}

executePipeline(() => cleanDirectory(dir), `Clean directory: ${dir}`)
  .pipe(transpile, `Build module`, { withoutSpinner: true })
  .execute()
