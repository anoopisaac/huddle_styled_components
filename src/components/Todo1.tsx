import { StyledCard } from './styles/Card.styled'
import { Grid } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import { Task } from './common';
declare var window:any;

export class Todo extends React.Component {
    url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=official";
    // const [todos, settodos] = useState([]);
    // const [taskEdit, setTaskEdit] = useState(false);
    // const [currTask, setCurrTask] = useState(null);
    tasks: Task[] = [];
    editTask: Task | undefined = undefined;
    constructor(props: any) {
        super(props);
        this.state = {
            // todos: [],
            // enableEditModal: true,
            // currentTask: null
        }
    }
    componentDidMount() {
        window['ee']=this;
        fetch(this.url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.tasks = result.Items;
                    // settodos(result.Items);
                    console.log(result);
                    this.setState({})
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.tasks = [];
                }
            )
    }
    updateTask = (task: Task) => {
        console.log(task);
        // setCurrTask(data);
        // todos.find(todo=>todo.task_id===data.task_id)
        this.tasks = this.tasks.map((item) => {
            return item.task_id === task.task_id ? task : item
        });
        this.setState({})
        // settodos(newTodos);
        console.log(this.tasks);
    }

    insertTask = async (event:any) => {
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

    render() {
        return (
            <Grid className="hello test">
                <Modal trigger={this.editTask} close={() => this.editTask = undefined}>
                    <TodoForm updateTask={this.updateTask} task={this.editTask} />
                </Modal>
                {this.tasks.map((task) =>
                    <div key={task.task_id} onClick={() => {this.editTask = task;this.setState({})}}>
                        <div> {task.task}</div>
                        <div> {task.priority}</div>
                    </div>
                )}
            </Grid>
        )
    }
}
