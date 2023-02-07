import { Loader } from "@aws-amplify/ui-react";
import { API, graphqlOperation } from "aws-amplify";
import moment from "moment";
import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { deleteTodo } from "./graphql/mutations";

const Item = ({ todo, index, setFormState, formState }) => {
  const [deleteLoad, setDeleteLoad] = useState(false);
  let wrapperStyle = {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  };
  const deleteItem = async (id) => {
    try {
      setDeleteLoad(true);
      const res = await API.graphql(
        graphqlOperation(deleteTodo, {
          input: { id },
        })
      );
      console.log("res", res);
      setDeleteLoad(false);
    } catch (err) {
      setDeleteLoad(false);
      console.log("error deleting todo:", err);
    }
  };
  return (
    <div
      className="item"
      style={{
        marginTop: index ? "8px" : 0,
      }}
    >
      <div className="todo-name">{todo.name}</div>

      <div className="item-sec-1">
        <div style={{ flexGrow: 1 }}>
          Last updated:{" "}
          <span
            style={{
              fontWeight: 500,
            }}
          >
            {moment(todo.updatedAt).fromNow()}
          </span>
        </div>
        {formState.id !== todo.id && (
          <div style={{ display: "flex" }}>
            <div style={wrapperStyle}>
              {deleteLoad ? (
                <Loader />
              ) : (
                <MdDelete
                  color="#5a5959"
                  fontSize="1.3rem"
                  onClick={() => deleteItem(todo.id)}
                />
              )}
            </div>
            <div style={wrapperStyle} onClick={() => setFormState(todo)}>
              <MdEdit color="#3380f0" fontSize="1.3rem" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
