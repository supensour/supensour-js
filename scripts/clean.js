const path = require('path')
const spinner = require('ora')()
const rm = require('rimraf')

function resolvePath(...pathParts) {
  return path.resolve(__dirname, '..', ...pathParts)
}

const dir = resolvePath(process.argv[2])
spinner.start('Cleaning directory: ' + dir)
rm(dir, {}, error => {
  if (error) {
    spinner.fail();
    throw error
  }
  spinner.succeed()
})
