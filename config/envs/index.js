const production = require('./production')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = production.name
}

module.exports = (function (env) {
  switch (env) {
    case 'dev': return require('./dev')
    case 'production': return production
    case 'test': return require('./test')
    default: throw new TypeError(`Invalid environment: ${env}`)
  }
})(process.env.NODE_ENV)
