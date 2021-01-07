const path = require('path')

function resolvePath(...pathParts) {
  return path.resolve(__dirname, '../..', ...pathParts)
}

module.exports = {
  name: 'base',
  mode: 'production',
  entry: {
    index: resolvePath('src/index.ts')
  },
  output: {
    path: resolvePath('dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }
}
