const { build: moduleBuild } = require('./model')

function build(gender, birthMonth, ownerId, owner) {
    return moduleBuild({ gender, birthMonth, ownerId, owner })
}

module.exports = { build }
