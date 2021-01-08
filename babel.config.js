let config

const lifecycle = process.env.npm_lifecycle_event
switch (lifecycle) {
  case 'dev:docs':
  case 'build:docs': config = require('./docs/babel.config')
    break
  default:
    throw new TypeError('Unsupported lifecycle using babel config: ' + lifecycle)
}

module.exports = config
