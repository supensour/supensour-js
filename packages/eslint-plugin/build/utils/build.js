const chalk = require('chalk')
const fs = require('fs')
const fse = require('fs-extra')
const { resolvePath } = require('.')

function copyFile (src, dest) {
  fse.copySync(src, dest, {
    overwrite: false,
    errorOnExist: true
  })
}

function buildPackage ({
  buildDir
} = {}) {
  console.log(chalk.cyan('### Build package'))

  console.log(`1. Clean directory: ${buildDir}`)
  fse.removeSync(buildDir)
  fse.ensureDirSync(buildDir)

  console.log('2. Build entry file')
  copyFile('./src/index.js', `${buildDir}/index.js`)

  console.log('3. Build config files')
  const configsDir = `${buildDir}/configs`
  fse.ensureDirSync(configsDir)
  copyFile('./src/configs', configsDir)
}

function prepareFilesForPublish ({
  publishDir
} = {}) {
  console.log(chalk.cyan('### Prepare files for publish'))

  console.log(`1. Prepare package.json`)
  const pkgJsonStr = fs.readFileSync(resolvePath('package.json'))
    .toString('utf8')
  const pkgJson = JSON.parse(pkgJsonStr)
  delete pkgJson.scripts
  delete pkgJson.devDependencies
  fs.writeFileSync(`${publishDir}/package.json`, JSON.stringify(pkgJson, null, 2))

  console.log(`3. Prepare README.md`)
  copyFile('README.md', `${publishDir}/README.md`)

  console.log(`3. Prepare LICENSE`)
  copyFile('../../LICENSE', `${publishDir}/LICENSE`)
}

module.exports = {
  buildPackage,
  prepareFilesForPublish
}
