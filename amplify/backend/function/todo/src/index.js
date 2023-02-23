/* Amplify Params - DO NOT EDIT
	API_REACTAMPLIFYTODO_GRAPHQLAPIENDPOINTOUTPUT
	API_REACTAMPLIFYTODO_GRAPHQLAPIIDOUTPUT
	API_REACTAMPLIFYTODO_GRAPHQLAPIKEYOUTPUT
	API_REACTAMPLIFYTODO_TODOTABLE_ARN
	API_REACTAMPLIFYTODO_TODOTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { resolvers } = require("./resolvers");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      return await resolver(event);
    }
  }
  throw new Error("Resolver not found.");
};
