const base = require('./base.config')
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin')
const path = require('path')
const pkg = require('../../package')
const { merge } = require('webpack-merge')

function resolvePath(...pathParts) {
  return path.resolve(__dirname, '../..', ...pathParts)
}

module.exports = merge(base, {
  name: 'production',
  mode: 'production',
  devtool: 'source-map',
  output: {
    libraryTarget: 'umd',
    library: pkg.name,
    umdNamedDefine: true
  },
  plugins: [
    // new DeclarationBundlerPlugin({
    //   moduleName: 'supensour',
    //   out: 'dist'
    // })
  ]
})
