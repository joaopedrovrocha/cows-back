const OwnerModel = require('../lib/models/owner')
const Dynamo = require('../lib/aws/dynamodb')

const { OWNER_TABLE } = process.env

function index(event, context, callback) {
    Dynamo
        .index(OWNER_TABLE)
        .then(owners => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: owners
                })
            })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to list owners.'
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
        .get(OWNER_TABLE, id)
        .then(owner => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: owner
                })
            })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to get owner.'
                })
            })
        })
}

function create(event, context, callback) {
    const requestBody = JSON.parse(event.body)

    const { name } = requestBody

    if (!name) {
        callback(new Error('Could not create new owner because of validation errors.'))
        return
    }

    const ownerDynamo = OwnerModel.build(name)

    Dynamo
        .create(OWNER_TABLE, ownerDynamo)
        .then(owner => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Owner Created!',
                    id: owner.id
                })
            })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to create owner.'
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

    const { name } = requestBody

    Dynamo
        .update(OWNER_TABLE, id, { name })
        .then(owner => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Owner Updated!',
                    data: owner
                })
            })
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Unable to update owner.'
                })
            })
        })
}

module.exports = { index, get, create, update }
