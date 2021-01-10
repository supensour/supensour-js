const pkg = require('./package.json')

const dir = `docs/${pkg.version}`
module.exports = {
  "entryPoints": [
    "src"
  ],
  "out": dir,
  "json": `${dir}/docs.json`,
  "includeVersion": true,
  "disableSources": true,
  "excludePrivate": true
}
