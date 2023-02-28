const { createQueryParams, batchDeleteParams } = require(".");
const { batchWrite, query } = require("../lib/dynamoDB");

const todoTable = process.env.API_REACTAMPLIFYTODO_TODOTABLE_NAME;

exports.deleteAllTodo = async (ctx) => {
  try {
    const { userId } = ctx;
    const date = new Date().toISOString();

    const todoRes = await query(createQueryParams(todoTable, userId));
    console.log("todoRes res", todoRes);

    const todoItems = todoRes?.Items || [];
    if (todoItems?.length) {
      const res = await batchWrite(batchDeleteParams(todoTable, todoItems));
      console.log("batchWrite res", res);
      return { id: "_", name: "_", createdAt: date, updatedAt: date, ...ctx };
    } else {
      const error = "The list is already empty.";
      console.log("error", error);
      throw new Error(error);
    }
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
