const chalk = require('chalk')
const {
  buildPackage,
  prepareFilesForPublish
} = require('../utils/build')
const { resolvePath } = require('../utils')

console.log(chalk.cyan('### Prepare for publish'))

const publishDir = 'dist-pub'

buildPackage({
  buildDir: publishDir
})

prepareFilesForPublish({
  publishDir: publishDir
})
