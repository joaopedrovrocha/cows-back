const AWS = require('aws-sdk')

AWS.config.setPromisesDependency(require('bluebird'))

const dynamoDb = new AWS.DynamoDB.DocumentClient()

function index(tableName) {
    const info = { TableName: tableName }

    return dynamoDb.scan(info).promise().then(res => res.Items)
}

function get(tableName, id) {
    const info = { TableName: tableName, Key: { id } }

    return dynamoDb.get(info).promise().then(res => res.Item)
}

function create(tableName, item) {
    const info = { TableName: tableName, Item: item }

    return dynamoDb.put(info).promise().then(res => item)
}

function update(tableName, id, item) {
    const info = {
        TableName: tableName,
        Key: {
            'id': id
        },
        UpdateExpression: 'set #SET',
        ExpressionAttributeValues: {},
        ExpressionAttributeNames: {},
        ReturnValues: "UPDATED_NEW"
    }

    const keys = Object.keys(item)

    let setConditions = []
    let setAttributeValues = {}
    let setAttributeNames = {}

    for (let i in keys) {
        let key = keys[i]
        let column = `column__${i}`

        setConditions.push(`#${column} = :${key}`)
        setAttributeValues[`:${key}`] = item[key]
        setAttributeNames[`#${column}`] = key
    }

    info.UpdateExpression = info.UpdateExpression.replace('#SET', setConditions.join(', '))
    info.ExpressionAttributeValues = setAttributeValues
    info.ExpressionAttributeNames = setAttributeNames

    return dynamoDb.update(info).promise().then(res => item)
}

module.exports = { index, get, create, update }
