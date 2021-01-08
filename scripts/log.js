const chalk = require('chalk')
const spinner = require('ora')()

function arr(n) {
  const idx = []
  for (let i = 0; i < n; i++) {
    idx.push(i)
  }
  return idx
}

function loop(n, action) {
  if (!isNaN(n) && typeof action === 'function') {
    arr(n).forEach(action)
  }
}

function repeatAndJoin(n, str) {
  return isNaN(n) ? '' : arr(n).map(() => `${str}`).join('')
}

const mode = process.argv[2]
if (mode === 'title') {
  const indentCount = Number(process.argv[3]) || 0
  const title = process.argv[4]
  const newLineAfterCount = Number(process.argv[5])
  let indent = repeatAndJoin(indentCount, '#')
  if (indent.length) indent += ' '
  console.log(chalk.cyan(indent + title))
  loop(newLineAfterCount, () => console.log())
} else if (/task-/.test(mode)) {
  const state = mode.substring('task-'.length)
  const task = process.argv[3]
  const newLineAfterCount = Number(process.argv[4])
  spinner.start(task)
  if (state === 'success') {
    spinner.succeed()
  } else if (state === 'failed') {
    spinner.fail()
  }
  loop(newLineAfterCount, () => console.log())
}
