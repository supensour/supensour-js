const chalk = require('chalk')
const fs = require('fs')
const pkg = require('../package.json')
const { executePipeline, resolvePath } = require('./utils')

console.log(chalk.cyan('### Prepare for sonar'))

const templatePath = resolvePath('sonar-project.template.properties')
const sonarPropertiesPath = resolvePath('sonar-project.properties')

function create () {
  const content = fs.readFileSync(templatePath).toString()
  const lines = (content || '').split('\n')
  for (const i in lines) {
    if (lines[i].startsWith('sonar.projectVersion')) {
      lines[i] = `sonar.projectVersion=${pkg.version}`
      break
    }
  }
  const editedContent = lines.join('\n')
  fs.writeFileSync(sonarPropertiesPath, editedContent)
}

executePipeline(create, `Create sonar-project.properties`)
  .execute()
