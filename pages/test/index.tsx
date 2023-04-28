import { machine } from "@/machines/myMachine";
import { useMachine } from "@xstate/react";
import React from "react";

export default function Index() {
  const [state, send] = useMachine(machine);

  return (
    <>
   
      {state.context.data.map((item, i) => (
        <div style={{ display: "flex" }} key={i}>
          <input
            onChange={() => send({ type: "change.status", i })}
            checked={item.isDone}
            type="checkbox"
          />
          <p style={item.isDone ? { textDecoration: "line-through" } : {}}>
            {item.message}
          </p>
          <button onClick={() => send({ type: "delete.todo", i })}>
            delete
          </button>
          <button onClick={() => send({ type: "edit.todo" })}>edit</button>
          {state.matches("editing todo") && (
            <div>
              <input
                onChange={(e) =>
                  send({ type: "change.input", data: e.target.value })
                }
                type="text"
              />
              <button onClick={() => send({ type: "save.todo", i })}>
                save
              </button>
            </div>
          )}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send("add.todo");
        }}
      >
        <input
          onChange={(e) => send({ type: "change.input", data: e.target.value })}
          type="text"
        />
      </form>
    </>
  );
}
