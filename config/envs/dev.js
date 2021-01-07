const base = require('./base')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

module.exports = merge(base, {
  name: 'dev',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js'
  },
  devServer: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT ? Number(process.env.PORT) : 10100,
    open: true,
    compress: true,

    overlay: { warnings: false, errors: true },
    historyApiFallback: {
      rewrites: [
      ]
    }
  },
  plugins: [
      new HTMLWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        inject: true
      })
  ]
})
