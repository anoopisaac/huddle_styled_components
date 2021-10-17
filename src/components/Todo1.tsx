import { Styler } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import { Task, TaskGroup } from './common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faEdit } from '@fortawesome/free-solid-svg-icons';
import './styles/common.scss'

declare var window: any;

export class Todo extends React.Component {
    url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=personal";
    // const [todos, settodos] = useState([]);
    // const [taskEdit, setTaskEdit] = useState(false);
    // const [currTask, setCurrTask] = useState(null);
    tasks: Task[] = [];
    taskGroups: TaskGroup[] = [];

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
        window['ee'] = this;
        fetch(this.url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.tasks = result.Items;
                    this.groupTasks(this.tasks);
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
        const existTask = this.tasks.find(item => item.taskId === task.taskId)
        if (existTask === undefined) {
            this.insertUpdateRemoteTask(true, task);
            this.tasks.push(task);
        } else {
            // setCurrTask(data);
            // todos.find(todo=>todo.task_id===data.task_id)
            this.tasks = this.tasks.map((item) => {
                return item.taskId === task.taskId ? task : item
            });
            this.insertUpdateRemoteTask(false, task);
        }

        this.setState({})
        // settodos(newTodos);
        console.log(this.tasks);
    }

    insertTask = () => {
        const newTask = new Task();
        const taskDate = new Date();
        newTask.dueDate = `${taskDate.getFullYear()}/${taskDate.getMonth() + 1}/${taskDate.getDate()}`
        newTask.taskText = "have fun";
        newTask.priority = "high";
        newTask.subTasks = [{ taskText: "", status: "notdone" }];
        newTask.tags = "fun";
        newTask.taskId = Math.round(Math.random() * 10000000000) + "";
        newTask.userProject = "anoop#personal"
        this.editTask = newTask;
        this.setState({});

    }

    insertUpdateRemoteTask = async (isInsert: boolean, task: Task) => {
        const taskId = Math.round(Math.random() * 10000000000);
        const response = await fetch('https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo', {
            method: isInsert ? 'POST' : 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        const data = await response.text();
        // enter you logic when the fetch is successful
        console.log(data);
    }

    groupTasks = (tasks: Task[]) => {
        const prevTasks: Task[] = [];
        const todayTasks: Task[] = [];
        const tomorrowTasks: Task[] = [];
        const restOfTheWeekTasks: Task[] = [];
        const nextWeekTasks: Task[] = [];
        const thereAfterTasks: Task[] = [];
        tasks.forEach(item => {
            const todayDateTime = new Date(new Date().toDateString()).getTime();
            const taskDate = new Date(item.dueDate);
            if (taskDate.getTime() < todayDateTime) {
                prevTasks.push(item);
            }
        })
        const prevTaskGroup = new TaskGroup("Previous", "Previous Task", prevTasks);
        this.taskGroups.push(prevTaskGroup);
    }

    render() {
        return (
            <Styler className="task-group-container" gtc="300px 200px" >
                <Modal trigger={this.editTask} close={() => { this.editTask = undefined; this.setState({}) }}>
                    <TodoForm updateTask={this.updateTask} task={this.editTask} />
                </Modal>
                {this.taskGroups.map((groupItem: TaskGroup) =>
                    <Styler gar="30px" key={groupItem.groupId} className="task-group" br="5px" bdr="1px solid #9e9e9e" p="10px">
                        <Styler bb="1px solid #9e9e9e" d="grid"><Styler as="span" als="center">{groupItem.groupTitle}</Styler></Styler>
                        {groupItem.tasks.map(taskItem =>
                            <Styler gtc="1fr 10px 10px 10px" cg="5px" key={taskItem.taskId} mb="4px" className="task" d="grid" ai="center">
                                <div> {taskItem.taskText}</div>
                                <Styler circle={taskItem.priority === "high" ? "red" : "#ff000040"} als="center" onClick={() => {
                                    taskItem.priority = taskItem.priority === "high" ? "low" : "high";
                                    this.updateTask(taskItem);
                                }}></Styler>
                                <Styler circle={taskItem.isUrgent === true ? "purple" : "#80008036"} als="center" onClick={() => {
                                    taskItem.isUrgent = taskItem.isUrgent === true ? false : true;
                                    this.updateTask(taskItem);
                                }}></Styler>
                                <Styler onClick={() => { this.editTask = taskItem; this.setState({}) }} als="center">
                                    <FontAwesomeIcon icon={faEdit} className="awesome-icon" />
                                </Styler>
                            </Styler>
                        )}
                    </Styler>
                )}
                {/* <div onClick={() => this.insertTask()}>insert task</div> */}
            </Styler>
        )
    }
}
