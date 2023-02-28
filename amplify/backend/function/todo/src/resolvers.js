const { deleteAllTodo } = require("./helper/deleteAllTodo");

exports.resolvers = {
  Mutation: {
    deleteAllTodo: async (ctx) => await deleteAllTodo(ctx.arguments),
  },
};
