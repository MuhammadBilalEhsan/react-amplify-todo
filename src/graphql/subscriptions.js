/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($userId: ID) {
    onCreateTodo(userId: $userId) {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($userId: ID) {
    onUpdateTodo(userId: $userId) {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($userId: ID) {
    onDeleteTodo(userId: $userId) {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAllTodo = /* GraphQL */ `
  subscription OnDeleteAllTodo($userId: ID) {
    onDeleteAllTodo(userId: $userId) {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;
