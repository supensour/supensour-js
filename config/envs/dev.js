const base = require('./base')
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

module.exports = merge(base, {
  name: 'dev',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT ? Number(process.env.PORT) : 10100,
    open: true,
    compress: true,
    overlay: {
      warnings: false,
      errors: true
    },
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    })
  ]
})
