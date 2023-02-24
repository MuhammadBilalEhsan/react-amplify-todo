/* src/App.js */
import { Loader, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { createTodo, deleteAllTodo, updateTodo } from "./graphql/mutations";
import { getTodoByUserId } from "./graphql/queries";

// import awsExports from "./aws-exports";
import "./App.css";
import {
  onCreateTodo,
  onDeleteAllTodo,
  onDeleteTodo,
  onUpdateTodo,
} from "./graphql/subscriptions";
import Item from "./Item";
// Amplify.configure(awsExports);

const initialState = {
  id: "",
  name: "",
};

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const attributes = user.attributes || {};
  let { sub } = attributes;

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  const fetchTodos = async () => {
    try {
      const todoData = await API.graphql(
        graphqlOperation(getTodoByUserId, {
          userId: sub,
        })
      );
      const todos = todoData.data.getTodoByUserId.items;
      setTodos(todos);
      setLoading(false);
    } catch (err) {
      console.log("error fetching todos");
    }
  };
  const handleClear = () => {
    setFormState(initialState);
  };
  let isUpdate = formState.id;
  let disableSubmit = !formState.name.trim() || submitLoad;
  const deleteAllDisabled = !todos.length || isUpdate;

  const deleteAll = async () => {
    try {
      setDeleteLoad(true);
      const res = await API.graphql(
        graphqlOperation(deleteAllTodo, { userId: sub })
      );
      console.log("res", res);
      setDeleteLoad(false);
    } catch (err) {
      setDeleteLoad(false);
      console.log("error creating todo:", err);
    }
  };
  const handleSubmit = async () => {
    try {
      if (!disableSubmit) {
        setSubmitLoad(true);
        if (isUpdate) {
          const res = await API.graphql(
            graphqlOperation(updateTodo, {
              input: { id: formState.id, name: formState.name.trim() },
            })
          );
        } else {
          const res = await API.graphql(
            graphqlOperation(createTodo, {
              input: { name: formState.name.trim(), userId: sub },
            })
          );

          // setTodos([...todos, res.data.createTodo]);
        }
        handleClear();
        setSubmitLoad(false);
      }
    } catch (err) {
      setSubmitLoad(false);
      console.log("error creating todo:", err);
    }
  };

  useEffect(() => {
    if (user) {
      let onCreateTodoSubs;
      let onDeleteTodoSubs;
      let onUpdateTodoSubs;
      let onDeleteAllTodoSubs;

      onCreateTodoSubs = API.graphql(
        graphqlOperation(
          onCreateTodo
          //  { filter: { userId: { eq: sub } } }
        )
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onCreateTodo;
          if (data.userId === sub) {
            setTodos((prev) => [...prev, data]);
          }
        },
        error: (error) => console.warn(error),
      });
      onUpdateTodoSubs = API.graphql(
        graphqlOperation(
          onUpdateTodo
          //  { filter: { userId: { eq: sub } } }
        )
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onUpdateTodo;
          if (data.userId === sub) {
            setTodos((prev) =>
              prev.map((item) => (item.id === data.id ? data : item))
            );
          }
        },
        error: (error) => console.warn(error),
      });
      onDeleteTodoSubs = API.graphql(
        graphqlOperation(
          onDeleteTodo
          // { filter: { userId: { eq: sub } } }
        )
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onDeleteTodo;
          if (data.userId === sub) {
            setTodos((prev) => prev.filter((item) => item.id !== data.id));
          }
        },
        error: (error) => console.warn(error),
      });
      onDeleteAllTodoSubs = API.graphql(
        graphqlOperation(onDeleteAllTodo) // { userId: sub }
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onDeleteAllTodo;
          const condition = data[0].userId === sub;
          console.log("condition:", condition);
          if (condition) {
            setTodos([]);
          }
        },
        error: (error) => console.warn(error),
      });

      return () => {
        if (onCreateTodoSubs) return onCreateTodoSubs.unsubscribe();
        if (onUpdateTodoSubs) return onUpdateTodoSubs.unsubscribe();
        if (onDeleteTodoSubs) return onDeleteTodoSubs.unsubscribe();
        if (onDeleteAllTodoSubs) return onDeleteAllTodoSubs.unsubscribe();
      };
    }
  }, [user]);

  return (
    <div className="App">
      <div className="curved">
        <nav className="header">
          <span className="name">Hi {user.username}</span>
          <button type="button" className="sign-out" onClick={signOut}>
            SignOut
          </button>
        </nav>
        Todo List
      </div>
      <div className="main">
        <form
          style={{ flexGrow: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            onChange={(event) => setInput("name", event.target.value)}
            value={formState.name}
            placeholder="Write todo..."
            className="input"
          />
          <input type="submit" hidden />
        </form>
        <div className="actions">
          <button
            type="button"
            onClick={deleteAll}
            className={`act-button delete ${
              deleteAllDisabled ? "disabled" : ""
            }`}
            disabled={deleteAllDisabled}
          >
            {deleteLoad ? <Loader /> : "Delete All"}
          </button>
          <button
            disabled={disableSubmit}
            onClick={handleSubmit}
            className={`act-button create-update ${
              disableSubmit ? "disabled" : ""
            }`}
          >
            {submitLoad ? (
              <Loader />
            ) : (
              <>{isUpdate ? "Update" : "Create"} Todo</>
            )}
          </button>
        </div>
        {loading ? (
          <Loader style={{ margin: "0 auto" }} />
        ) : todos.length ? (
          todos.map((todo, index) => (
            <Item
              key={todo.id ? todo.id : index}
              todo={todo}
              index={index}
              setFormState={setFormState}
              formState={formState}
              handleClear={handleClear}
            />
          ))
        ) : (
          <div className="no-data">No todo available</div>
        )}
      </div>
    </div>
  );
};

export default withAuthenticator(App);
