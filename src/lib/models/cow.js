const { build: moduleBuild } = require('./model')

function build(gender, birthMonth, ownerId, owner, name, quantity) {
    return moduleBuild({ gender, birthMonth, ownerId, owner, name, quantity })
}

module.exports = { build }
