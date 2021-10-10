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

    return (
        <Grid className="hello" gtr="200px 100px" gta="20px">
            {todos.map((todo) =>
                <div key={todo.task_id}>
                    {todo.task}
                </div>
            )}
        </Grid>
    )
}
