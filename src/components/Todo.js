import { StyledCard } from './styles/Card.styled'
import { Grid } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
export default function Todo({ url }) {
    url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=official";
    const [todos, settodos] = useState([]);
    const [taskEdit, setTaskEdit] = useState(false);
    const [currTask, setCurrTask] = useState(null);
    let task;
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    settodos(result.Items);
                    console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    settodos([])
                }
            )
    }, [url]);

    const updateTask = (data) => {
        console.log(data);
        // setCurrTask(data);
        // todos.find(todo=>todo.task_id===data.task_id)
        const newTodos = todos.map((item) => {
            return item.task_id === data.task_id?data:item
        });

        settodos(newTodos);
        console.log(newTodos);
    }

    const insertTask = async (event) => {
        const taskId = Math.round(Math.random() * 10000000000);
        const response = await fetch('https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userProject": "anoop#official",
                "taskId": taskId,
                "dueDate": "2021/10/11",
                "tags": "ihcs",
                "subTasks": ["do something"],
                "task": "do what",
                "priority": "high",
                "duration": 10
            })
        });
        const data = await response.json();
        // enter you logic when the fetch is successful
        console.log(data);
    }

    return (
        <Grid className="hello test">
            <Modal trigger={taskEdit}>
                <TodoForm updateTask={updateTask} task={currTask} />
            </Modal>
            {todos.map((todo) =>
                <div key={todo.task_id} onClick={() => { setTaskEdit(true); setCurrTask(todo) }}>
                   
                    <div> {todo.task}</div>
                    <div> {todo.priority}</div>
                </div>
            )}
        </Grid>
    )
}
