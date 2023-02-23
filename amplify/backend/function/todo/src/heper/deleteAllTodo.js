const { deleteBatch } = require("../lib/dynamoDB");

const todoTable = process.env.API_REACTAMPLIFYTODO_TODOTABLE_NAME;

exports.deleteAllTodo = async (ctx) => {
  try {
    const { userId } = ctx;
    const res = await deleteBatch(userId, todoTable);
    console.log("res batch", res);
    return res;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
