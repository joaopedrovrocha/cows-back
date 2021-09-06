const uuid = require('uuid')
const timestamp = new Date().getTime()

function build(parameters) {
    return {
        id: uuid.v1(),
        createdAt: timestamp,
        ...parameters
    }
}

module.exports = { build }