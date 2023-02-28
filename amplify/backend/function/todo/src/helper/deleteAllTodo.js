const { deleteBatch } = require("../lib/dynamoDB");

const todoTable = process.env.API_REACTAMPLIFYTODO_TODOTABLE_NAME;

exports.deleteAllTodo = async (ctx) => {
  try {
    const { userId } = ctx;
    const date = new Date().toISOString();
    const res = await deleteBatch(userId, todoTable);
    console.log("res batch", res);
    return { id: "_", name: "_", createdAt: date, updatedAt: date, ...ctx };
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
