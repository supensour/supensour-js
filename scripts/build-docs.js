const chalk = require('chalk')
const fs = require('fs')
const typedocConfig = require('../typedoc.template')
const { execSync } = require('child_process')
const { cleanDirectory, executePipeline, resolvePath } = require('./utils')

console.log(chalk.cyan('### Build documentation'))

const dir = resolvePath(typedocConfig.out)

function createTypedocJson () {
  const content = JSON.stringify(typedocConfig, null, 2)
  fs.writeFileSync(resolvePath('typedoc.json'), content)
}

function typedoc () {
  const childProcess = execSync('typedoc', { stdio: 'inherit' })
  if (childProcess && childProcess.error) {
    throw childProcess.error
  }
  return childProcess instanceof Buffer ? childProcess.toString() : childProcess
}

executePipeline(() => cleanDirectory(dir), `Clean directory: ${dir}`)
  .pipe(createTypedocJson, `Create typedoc.json`)
  .pipe(() => fs.mkdirSync(dir, { recursive: true }), `Prepare directory: ${dir}`)
  .pipe(typedoc, `Generate documentation`)
  .execute()
