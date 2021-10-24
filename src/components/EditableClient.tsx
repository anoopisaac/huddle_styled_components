import React, { useState } from "react";

import Editable from "./Editable";

export function EditableClient() {
  // State for the input
  const [task, setTask] = useState("");

  /*
    Enclose the input element as the children to the Editable component to make it as inline editable.
  */
  return (
    <Editable
      text={task}
      placeholder="Write a task name"
      type="input"
      width="200px"
      style={{ display: "grid" }}
    >
      <input
        type="text"
        name="task"
        placeholder="Write a task name"
        value={task}
        onChange={e => setTask(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box" }}
      />
    </Editable>
  );
}