const chalk = require('chalk')
const config = require('../config/envs')
const spinner = require('ora')()
const rm = require('rimraf')

console.log(chalk.cyan('### Cleaning'))
spinner.start('Cleaning output directory: ' + config.output.path + '\n')
rm.sync(config.output.path)
spinner.succeed()
