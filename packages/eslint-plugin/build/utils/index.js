const path = require('path')

function resolvePath (...pathParts) {
  return path.resolve(__dirname, '../..', ...pathParts)
}

module.exports = {
  resolvePath
}
