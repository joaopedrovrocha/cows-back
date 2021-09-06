const { build: moduleBuild } = require('./model')

function build(name) {
    return moduleBuild({ name })
}

module.exports = { build }
