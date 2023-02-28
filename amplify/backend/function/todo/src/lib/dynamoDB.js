const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const query = async (params) => await docClient.query(params).promise();

const batchWrite = async (params) =>
  await docClient.batchWrite(params).promise();

module.exports = { query, batchWrite };
