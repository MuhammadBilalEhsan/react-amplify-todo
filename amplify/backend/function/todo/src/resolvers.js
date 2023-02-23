const { deleteAllTodo } = require("./heper/deleteAllTodo");

exports.resolvers = {
  Mutation: {
    deleteAllTodo: async (ctx) => await deleteAllTodo(ctx.arguments),
  },
};
