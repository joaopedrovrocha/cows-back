const CowModel = require('../lib/models/cow')
const Dynamo = require('../lib/aws/dynamodb')

const { COW_TABLE, OWNER_TABLE } = process.env

function index(event, context, callback) {
    Dynamo
        .index(COW_TABLE)
        .then(cows => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: cows
                })
            })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to list cows.'
                })
            })
        })
}

function get(event, context, callback) {
    let id = null

    try {
        id = event.pathParameters.id

    } catch (e) {
        return callback(new Error(e))
    }

    Dynamo
        .get(COW_TABLE, id)
        .then(cow => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: cow
                })
            })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to get cow.'
                })
            })
        })
}

function create(event, context, callback) {
    const requestBody = JSON.parse(event.body)

    const { gender, birthMonth, ownerId, name, quantity } = requestBody

    if (!gender || !birthMonth || !ownerId) {
        callback(new Error('Could not create new cow because of validation errors.'))
        return
    }

    // find owner to save reference on cow table
    Dynamo
        .get(OWNER_TABLE, ownerId)
        .then(owner => {
            const cowDynamo = CowModel.build(gender, birthMonth, ownerId, owner, name, quantity)

            Dynamo
                .create(COW_TABLE, cowDynamo)
                .then(cow => {
                    callback(null, {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: 'Cow Created!',
                            id: cow.id
                        })
                    })
                })
                .catch(err => {
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: 'Unable to create cow.'
                        })
                    })
                })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to create cow. Owner not found.'
                })
            })
        })
}

function update(event, context, callback) {
    const requestBody = JSON.parse(event.body)

    let id = null

    try {
        id = event.pathParameters.id

    } catch (e) {
        return callback(new Error(e))
    }

    const { gender, birthMonth, ownerId, name, quantity } = requestBody

    // find owner to save reference on cow table
    Dynamo
        .get(OWNER_TABLE, ownerId)
        .then(owner => {
            Dynamo
                .update(COW_TABLE, id, { gender, birthMonth, ownerId, owner, name, quantity })
                .then(cow => {
                    callback(null, {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: 'Cow Updated!',
                            data: cow
                        })
                    })
                })
                .catch(err => {
                    callback(null, {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: 'Unable to update cow.'
                        })
                    })
                })
        })
}

module.exports = { index, get, create, update }
