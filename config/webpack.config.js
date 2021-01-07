const config = require('./envs')
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const path = require('path')
const { merge } = require('webpack-merge')

function resolvePath(...pathParts) {
  return path.resolve(__dirname, '..', ...pathParts)
}

const webpackConfig = {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolvePath('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/,

      }
    ]
  },
  plugins: [
      new ForkTsCheckerWebpackPlugin()
  ]
}

module.exports = merge(webpackConfig, config)
