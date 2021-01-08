const production = require('./production.config.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = production.name
}

module.exports = (function (env) {
  switch (env) {
    case 'dev': return require('./dev.config.js')
    case 'production': return production
    case 'test': return require('./test.config.js')
    default: throw new TypeError(`Invalid environment: ${env}`)
  }
})(process.env.NODE_ENV)
