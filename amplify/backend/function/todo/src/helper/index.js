const createQueryParams = (TableName, userId) => ({
  TableName,
  IndexName: "byUserId",
  KeyConditionExpression: "userId = :userId",
  ExpressionAttributeValues: {
    ":userId": userId,
  },
});

const batchDeleteParams = (table, list) => ({
  RequestItems: {
    [table]: list?.map((item) => ({
      DeleteRequest: {
        Key: { id: item?.id },
      },
    })),
  },
});
module.exports = { createQueryParams, batchDeleteParams };
