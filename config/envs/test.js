const base = require('./base')
const { merge } = require('webpack-merge')

module.exports = merge(base, {
  name: 'test',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
})
