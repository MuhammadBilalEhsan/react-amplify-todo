const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const deleteBatch = async (userId, TableName) => {
  try {
    const params = {
      TableName,
      IndexName: "byUserId",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const res = await docClient.query(params).promise();

    const items = res?.Items || [];

    console.log("items", items);

    if (items?.length) {
      await docClient
        .batchWrite({
          RequestItems: {
            [TableName]: items?.map((item) => ({
              DeleteRequest: {
                Key: { id: item?.id },
              },
            })),
          },
        })
        .promise();
    }
    return items;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
module.exports = { deleteBatch };
