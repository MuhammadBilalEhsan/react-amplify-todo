const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const deleteBatch = async (userId, tableName) => {
  console.log("tableName:", tableName);
  console.log("userId:", userId);
  const params = {
    TableName: tableName,
    Key: { userId },
  };

  try {
    while (true) {
      const { Items } = await docClient.scan(params).promise();
      console.log("Items:", Items);
      if (Items.length === 0) return [];

      const batchParams = {
        RequestItems: {
          [tableName]: Items.map(({ userId, createdAt }) => {
            console.log("Deleting item:", { userId, createdAt });
            return {
              DeleteRequest: { Key: { userId, createdAt } },
            };
          }),
        },
      };
      console.log("batchParams:", batchParams);

      await docClient.batchWrite(batchParams).promise();
    }
  } catch (err) {
    console.error("Error deleting objects:", err);
    throw new Error(err);
  }
};

module.exports = { deleteBatch };
