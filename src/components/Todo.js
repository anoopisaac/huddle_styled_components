import { StyledCard } from './styles/Card.styled'
import { Grid } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';


export default function Todo({ url }) {
    url = "https://8ielcob36m.execute-api.us-east-1.amazonaws.com/beta";
    const [todos, settodos] = useState([]);
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

    const insertTask = async(event) => {
        const taskId=Math.round(Math.random()*10000000000);
        const response = await fetch('https://8ielcob36m.execute-api.us-east-1.amazonaws.com/beta/hello', {
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
        <Grid className="hello test" gac="350px">
            {todos.map((todo) =>
                <div key={todo.task_id} onClick={() => insertTask()}>
                    {todo.task}
                </div>
            )}
        </Grid>
    )
}
