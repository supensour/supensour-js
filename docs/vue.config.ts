const path = require('path')
import { ProjectOptions } from '@vue/cli-service'

function resolvePath(...pathParts: String[]) {
  return path.resolve(__dirname, ...pathParts)
}

const env: string = process.env.NODE_ENV || 'production'
const devServerHost: string = process.env.HOST
const devServerPort: number = parseInt(process.env.port)

module.exports = {
  productionSourceMap: env !== 'production',
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': resolvePath('src'),
        '@Module': resolvePath('../dist')
      }
    },
    devServer: {
      host: devServerHost,
      port: isNaN(devServerPort) ? 10100 : devServerPort,
      open: true,
      compress: true,
      overlay: {
        warnings: false,
        errors: true
      }
    }
  }
} as ProjectOptions
