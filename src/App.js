import { Loader, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { createTodo, deleteAllTodo, updateTodo } from "./graphql/mutations";
import { getTodoByUserId } from "./graphql/queries";

import "./App.css";
import {
  onCreateTodo,
  onDeleteAllTodo,
  onDeleteTodo,
  onUpdateTodo,
} from "./graphql/subscriptions";
import Item from "./Item";

const initialState = {
  id: "",
  name: "",
};

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState);
  const [todo, setTodo] = useState([]);
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
      const todo = todoData.data.getTodoByUserId.items;
      setTodo(todo);
      setLoading(false);
    } catch (err) {
      console.log("error fetching todo");
    }
  };
  const handleClear = () => {
    setFormState(initialState);
  };
  let isUpdate = formState.id;
  let disableSubmit = !formState.name.trim() || submitLoad;
  const deleteAllDisabled = !todo.length || isUpdate;

  const deleteAll = async () => {
    try {
      setDeleteLoad(true);
      await API.graphql(graphqlOperation(deleteAllTodo, { userId: sub }));
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
          await API.graphql(
            graphqlOperation(updateTodo, {
              input: { id: formState.id, name: formState.name.trim() },
            })
          );
        } else {
          await API.graphql(
            graphqlOperation(createTodo, {
              input: { name: formState.name.trim(), userId: sub },
            })
          );
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

      const commonCondition = {
        userId: sub,
      };

      onCreateTodoSubs = API.graphql(
        graphqlOperation(onCreateTodo, commonCondition)
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onCreateTodo;

          setTodo((prev) => [...prev, data]);
        },
        error: (error) => console.warn(error),
      });
      onUpdateTodoSubs = API.graphql(
        graphqlOperation(onUpdateTodo, commonCondition)
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onUpdateTodo;
          setTodo((prev) =>
            prev.map((item) => (item.id === data.id ? data : item))
          );
        },
        error: (error) => console.warn(error),
      });
      onDeleteTodoSubs = API.graphql(
        graphqlOperation(onDeleteTodo, commonCondition)
      ).subscribe({
        next: ({ provider, value }) => {
          let data = value.data.onDeleteTodo;
          setTodo((prev) => prev.filter((item) => item.id !== data.id));
        },
        error: (error) => console.warn(error),
      });
      onDeleteAllTodoSubs = API.graphql(
        graphqlOperation(onDeleteAllTodo, commonCondition)
      ).subscribe({
        next: ({ provider, value }) => {
          // let data = value.data.onDeleteAllTodo;

          setTodo([]);
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
          <span className="name">
            Hi <span className="user-name"> {user.username}</span>
          </span>
          <button type="button" className="sign-out" onClick={signOut}>
            Sign Out
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
        ) : todo.length ? (
          todo.map((todo, index) => (
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
