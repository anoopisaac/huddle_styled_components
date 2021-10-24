import { Styler } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import { AppState, Task, TaskGroup, TaskGroupNames } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faEdit } from '@fortawesome/free-solid-svg-icons';
import './styles/common.scss'
import { fetchTasks, getState } from '../StateService';
import { messageService } from '../Message';
import { Subscription } from 'rxjs';
import { EditableClient } from './EditableClient';

declare var window: any;

export class Todo extends React.Component {
    url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=personal";
    // const [todos, settodos] = useState([]);
    // const [taskEdit, setTaskEdit] = useState(false);
    // const [currTask, setCurrTask] = useState(null);
    // tasks: Task[] = [];
    // taskGroups: TaskGroup[] = [];
    // const [todos, settodos] = useState([]);
    // const [taskEdit, setTaskEdit] = useState(false);
    // const [currTask, setCurrTask] = useState(null);
    // tasks: Task[] = [];
    // taskGroups: TaskGroup[] = [];
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
            this.appState?.selectedTaskGroup?.tasks.push(task);
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
        const newTask = new Task();
        const taskDate = new Date();
        newTask.dueDate = `${taskDate.getFullYear()}/${taskDate.getMonth() + 1}/${taskDate.getDate()}`
        newTask.taskText = "have fun";
        newTask.priority = "high";
        newTask.subTasks = [{ taskText: "", status: "notdone" }];
        newTask.tags = "fun";
        newTask.taskId = Math.round(Math.random() * 10000000000) + "";
        newTask.userProject = "anoop#personal"
        newTask.isUrgent = false;
        newTask.duration = 10;
        this.editTask = newTask;
        this.setState({});
    }

    getTask = () => {
        const newTask = new Task();
        const taskDate = new Date();
        newTask.dueDate = `${taskDate.getFullYear()}/${taskDate.getMonth() + 1}/${taskDate.getDate()}`
        newTask.taskText = "have fun";
        newTask.priority = "high";
        newTask.subTasks = [{ taskText: "", status: "notdone" }];
        newTask.tags = "fun";
        newTask.taskId = Math.round(Math.random() * 10000000000) + "";
        newTask.userProject = "anoop#personal"
        newTask.isUrgent = false;
        newTask.duration = 10;
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
                            {/* <Styler xs={{ als: "center" }} ><input type="text" name="" id="" className="form-control" placeholder="Add Task" /></Styler> */}
                            <Styler xs={{ als: "center" }} ><EditableClient></EditableClient></Styler>
                            <Styler xs={{ gtr: "30px" }} >
                                {selectedTaskGroup.tasks.map(taskItem =>
                                    <Styler xs={{ gtc: "1fr 30px 10px", cg: "5px", mb: "4px", d: "grid", ai: "center" }} key={taskItem.taskId} className="task">
                                        <Styler ellipsis="" xs={{ mw: "180px" }}> {taskItem.taskText}</Styler>
                                        <TaskPriority task={this.appState.tasks[0]} updateTask={this.updateTask}></TaskPriority>
                                        <Styler onClick={() => { this.editTask = taskItem; this.setState({}) }} xs={{ als: "center" }}>
                                            <FontAwesomeIcon icon={faEdit} className="awesome-icon" />
                                        </Styler>
                                    </Styler>
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
        <Styler xs={{ gtc: "10px 10px", cg: "5px" }} >
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

