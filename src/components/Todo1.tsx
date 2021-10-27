import { Styler } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import { AppState, Task, TaskGroup, TaskGroupNames, TaskStatus } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faEdit } from '@fortawesome/free-solid-svg-icons';
import './styles/common.scss'
import { fetchTasks, getState } from '../StateService';
import { messageService } from '../Message';
import { Subscription } from 'rxjs';
import Editable from './Editable';
import { Checkbox, Divider } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


declare var window: any;

export class Todo extends React.Component {
    url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=personal";
    appState!: AppState;
    editTask: Task | undefined = undefined;
    constructor(props: any) {
        super(props);
        this.state = {
            // todos: [],
            // enableEditModal: true,
            // currentTask: null
        }
    }

    subscription: Subscription | undefined;

    componentDidMount() {
        this.appState = getState();
        this.subscription = messageService.getMessage().subscribe(data => {
            console.log(this.appState?.selectedTaskGroup.tasks, "eeeee");
            this.setState({});
        })
        window['ee'] = this;
        fetchTasks(TaskGroupNames.ANY_DAY);
    }
    componentWillUnmount() {
        this.subscription?.unsubscribe();
    }
    updateTask = (task: Task) => {
        console.log(task);
        const existTask = this.appState.tasks.find(item => item.taskId === task.taskId)
        const selectedTaskGroup = this.appState.selectedTaskGroup;
        if (existTask === undefined) {
            this.insertUpdateRemoteTask(true, task);
            this.appState?.selectedTaskGroup?.tasks.unshift(task);
        } else {
            // setCurrTask(data);
            // todos.find(todo=>todo.task_id===data.task_id)
            selectedTaskGroup.tasks = selectedTaskGroup.tasks.map((item) => {
                return item.taskId === task.taskId ? task : item
            });
            this.insertUpdateRemoteTask(false, task);
        }
        this.setState({})
        // settodos(newTodos);
        // console.log(this.tasks);
    }

    insertTask = () => {
        const newTask = this.getTask();
        this.editTask = newTask;
        this.setState({});
    }

    insertOnEnter = (taskText: string) => {
        const newTask = this.getTask();
        newTask.taskText = taskText;
        this.updateTask(newTask);
    }

    getTask = () => {
        const newTask = new Task();
        const taskDate = new Date();
        newTask.dueDate = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}-${taskDate.getDate()}`
        newTask.taskText = "have fun";
        newTask.priority = "high";
        newTask.subTasks = [{ taskText: "", status: "notdone" }];
        newTask.tags = "fun";
        newTask.taskId = Math.round(Math.random() * 10000000000) + "";
        newTask.userProject = "anoop#personal"
        newTask.isUrgent = false;
        newTask.duration = 10;
        newTask.taskStatus = TaskStatus.NOTDONE;
        return newTask;
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
    onChange(event: any, task: Task) {
        console.log(event.target.name, event.target.value);
        const ee: string = event.target.name;
        Object.assign(task, { [event.target.name]: event.target.value })
        this.setState({});

    }

    onDateChange(task: Task, value: any) {
        // console.log(event.target.name, event.target.value);
        // const ee: string = event.target.name;
        const taskDate = value;
        const dateString = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}-${taskDate.getDate()}`
        Object.assign(task, { dueDate: dateString })
        this.updateTask(task);
        this.setState({});

    }

    closeModal = () => {
        // console.log(getState().hello);
        this.editTask = undefined;
        this.setState({})
    }
    render() {
        const selectedTaskGroup = this.appState?.selectedTaskGroup;
        return (
            <Styler className="task-group-container" xs={{ gtc: "700px 1fr" }}>
                <Modal trigger={this.editTask} close={() => this.closeModal()} width="600px" height="300px">
                    <TodoForm updateTask={this.updateTask} task={this.editTask} />
                </Modal>
                {
                    (selectedTaskGroup &&
                        <Styler xs={{ gar: "30px 40px 1fr", br: "5px", p: "10px" }} key={selectedTaskGroup.groupId} className="task-group">
                            <Styler as="span" als="center">{selectedTaskGroup.groupTitle}</Styler>
                            <Styler xs={{ als: "center" }} >
                                <input type="text" name="" id="" className="form-control" placeholder="Add Task"
                                    onKeyDown={(e: any) => {
                                        if (e.code === "Enter") {
                                            this.insertOnEnter(e.target.value);
                                            e.target.value = ""
                                        }
                                    }}
                                />
                            </Styler>
                            <Styler xs={{ gar: "max-content" }} >
                                {selectedTaskGroup.tasks.map(taskItem =>
                                    <div key={taskItem.taskId} >
                                        <Styler xs={{ gtc: "20px 1fr 10px 75px", gta: "'check task priority date'", cg: "5px", mb: "4px", d: "grid", ai: "center", ht: "30px" }} className="task">
                                            <Checkbox checked={taskItem.taskStatus === TaskStatus.DONE} onChange={() => { taskItem.taskStatus = (taskItem.taskStatus === TaskStatus.DONE ? TaskStatus.NOTDONE : TaskStatus.DONE); this.updateTask(taskItem); this.setState({}) }} inputProps={{ 'aria-label': 'controlled' }} style={{ gridArea: "check" }} size="small" />
                                            <Styler xs={{ mw: "600px", ga: "task" }}>
                                                <Editable text={taskItem.taskText} placeholder="Write a task name" type="input" update={() => this.updateTask(taskItem)}>
                                                    <input type="text" name="task" placeholder="Write a task name" value={taskItem.taskText} onChange={e => { taskItem.taskText = e.target.value; this.setState({}) }} style={{ width: "100%", boxSizing: "border-box", height: "25px" }} />
                                                </Editable>
                                            </Styler>
                                            <TaskPriority task={taskItem} updateTask={this.updateTask} style={{ gridArea: "priority" }} ga="priority"></TaskPriority>
                                            {/* <input type="date" id="start" name={'dueDate'} value={taskItem.dueDate} onChange={(event: any) => this.onChange(event, taskItem)} data-date-inline-picker="true"/> */}
                                            <DatePicker
                                                selected={new Date(taskItem.dueDate)}
                                                onChange={(date) => this.onDateChange(taskItem, date)}
                                                onCalendarClose={() => { }}
                                                onCalendarOpen={() => { }}
                                            />
                                            {/* <Styler onClick={() => { this.editTask = taskItem; this.setState({}) }} xs={{ als: "center" }}>
                                                <FontAwesomeIcon icon={faEdit} className="awesome-icon" />
                                            </Styler> */}
                                        </Styler>
                                        <hr></hr>
                                    </div>
                                )}

                            </Styler>
                        </Styler>
                    )
                }
                {/* <div onClick={() => this.insertTask()}>insert task</div> */}
            </Styler>
        )
    }

}

const TaskPriority: any = (props: any) => {
    return (
        <Styler xs={{ gtc: "10px 10px", cg: "5px", ga: props.ga }} >
            <Styler xs={{ als: "center", circle: props.task.priority === "high" ? "red" : "#ff000040" }} onClick={() => {
                props.task.priority = props.task.priority === "high" ? "low" : "high";
                props.updateTask(props.task);
            }}></Styler>
            {/* <Styler circle={props.task.isUrgent === true ? "purple" : "#80008036"} als="center" onClick={() => {
                props.task.isUrgent = props.task.isUrgent === true ? false : true;
                props.updateTask(props.task);
            }}></Styler> */}
        </Styler>

    );
}



function hello() {
    return (<div></div>)
}

