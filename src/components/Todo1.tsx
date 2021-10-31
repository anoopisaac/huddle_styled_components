import { Styler } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import { AppState, SortOrder, SubTask, Tag, Task, TaskGroup, TaskGroupNames, TaskStatus } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faTag } from '@fortawesome/free-solid-svg-icons';
import './styles/common.scss'
import { fetchTasks, getState, sortTaskFn } from '../StateService';
import { messageService } from '../Message';
import { Subscription } from 'rxjs';
import Editable from './Editable';
import { Button, Checkbox } from '@mui/material';
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

    generateRandomId = () => Math.round(Math.random() * 10000000000) + "";

    getTask = () => {
        const newTask = new Task();
        const taskDate = new Date();
        newTask.dueDate = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}-${taskDate.getDate()}`
        newTask.taskText = "have fun";
        newTask.priority = "high";
        newTask.subTasks = [];
        // newTask.subTasks = [{ taskText: "", taskStatus: TaskStatus.NOTDONE, subTaskId: this.generateRandomId() }];
        newTask.tags = [];
        newTask.taskId = this.generateRandomId();
        newTask.userProject = "anoop#personal"
        newTask.isUrgent = false;
        newTask.duration = 10;
        newTask.taskStatus = TaskStatus.NOTDONE;
        return newTask;
    }

    insertUpdateRemoteTask = async (isInsert: boolean, task: Task) => {
        // const taskId = Math.round(Math.random() * 10000000000);
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
    toggleTaskStatus = (parentTask: Task, task: Task | SubTask) => {
        task.taskStatus = task.taskStatus === TaskStatus.NOTDONE ? TaskStatus.DONE : TaskStatus.NOTDONE;
        this.updateTask(parentTask);
        this.setState({});
    }
    toggleSubTask = (taskItem: Task) => {
        taskItem._isSubTaskOpen = taskItem._isSubTaskOpen !== true ? true : false;
        this.setState({});
    }
    toggleTags = (taskItem: Task) => {
        taskItem._isTagOpen = taskItem._isTagOpen !== true ? true : false;
        this.setState({});
    }
    currentSortOrder = SortOrder.DESC;
    sortTask = () => {
        const selectedTaskGroup = this.appState?.selectedTaskGroup
        this.currentSortOrder = this.currentSortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;
        selectedTaskGroup.tasks = sortTaskFn(this.currentSortOrder, selectedTaskGroup.tasks);
        this.setState({});
    }
    onDurationBlur = (task: Task) => {
        this.updateTask(task);
    }
    addTag = (task: Task, name: string) => {
        task.tags.push({ name });
        this.setState({})
    }
    addSubTask = (task: Task, taskText: string) => {
        task.subTasks.push({ subTaskId: this.generateRandomId(), taskText, taskStatus: TaskStatus.NOTDONE });
        this.updateTask(task);
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
                            <Styler xs={{ gtc: "max-content 1fr max-content" }}>
                                <Styler as="span" als="center" className="txt title">{selectedTaskGroup.groupTitle}</Styler>
                                <div></div>
                                <Button variant="outlined" size="small" onClick={() => this.sortTask()}>Sort</Button>
                            </Styler>
                            <Styler xs={{ als: "center" }} >
                                <input type="text" name="" id="" className="form-control add-task" placeholder="Add Task"
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
                                    <Styler key={taskItem.taskId} xs={{ gar: "max-content" }}>
                                        <Styler xs={{ gtc: "10px 20px 1fr 40px 75px 10px 10px", gta: "'down-arrow check task duration date priority tag'", cg: "5px", mb: "4px", d: "grid", ai: "center", ht: "30px" }} className="task">
                                            {< FontAwesomeIcon icon={taskItem._isSubTaskOpen === true ? faAngleUp : faAngleDown} className="awesome-icon" style={{ gridArea: "down-arrow", cursor: "pointer" }} onClick={() => this.toggleSubTask(taskItem)} />}
                                            {taskItem.subTasks.length == 0 && <div style={{ gridArea: "down-arrow" }}></div>}
                                            <Checkbox checked={taskItem.taskStatus === TaskStatus.DONE} onChange={() => this.toggleTaskStatus(taskItem, taskItem)} inputProps={{ 'aria-label': 'controlled' }} style={{ gridArea: "check" }} size="small" />
                                            <Styler xs={{ mw: "600px", ga: "task" }}>
                                                <Editable text={taskItem.taskText} type="input" update={() => this.updateTask(taskItem)}>
                                                    <Styler as="input" type="text" name="taskText" placeholder="Task" value={taskItem.taskText} onChange={(e: any) => this.onChange(e, taskItem)} xs={{ wd: "100%", bs: "border-box", ht: "20px", fs: "small", bdr: "1px solid #ced4da", pl: "3px" }} />
                                                </Editable>
                                            </Styler>
                                            {/* <input type="date" id="start" name={'dueDate'} value={taskItem.dueDate} onChange={(event: any) => this.onChange(event, taskItem)} data-date-inline-picker="true"/> */}
                                            <input type="text" name="duration" id="" style={{ width: "90%", gridArea: 'duration', justifySelf: "center" }} value={taskItem.duration} onChange={e => this.onChange(e, taskItem)} onBlur={e => this.onDurationBlur(taskItem)} className="row-input" />
                                            <DatePicker
                                                selected={new Date(taskItem.dueDate)}
                                                onChange={(date) => this.onDateChange(taskItem, date)}
                                                onCalendarClose={() => { }}
                                                onCalendarOpen={() => { }}
                                                className="row-input"
                                            />
                                            <TaskPriority task={taskItem} updateTask={this.updateTask} style={{ gridArea: "priority" }} ga="priority"></TaskPriority>
                                            < FontAwesomeIcon icon={faTag} className="awesome-icon" style={{ gridArea: "tag", cursor: "pointer" }} onClick={() => this.toggleTags(taskItem)} />

                                            {/* <Styler onClick={() => { this.editTask = taskItem; this.setState({}) }} xs={{ als: "center" }}>
                                                <FontAwesomeIcon icon={faEdit} className="awesome-icon" />
                                            </Styler> */}
                                        </Styler>
                                        <hr></hr>
                                        <SubTasks taskItem={taskItem} todo={this}></SubTasks>
                                        <Tags taskItem={taskItem} todo={this}></Tags>
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

const SubTasks: any = (props: { taskItem: Task, todo: Todo }) => {
    const { taskItem, todo } = props;
    // const taskItem;
    return (
        <React.Fragment>
            {taskItem._isSubTaskOpen === true && <Styler as="input" type="text" name="" id="" className="form-control add-subtasks" placeholder="Add Sub Tasks" xs={{ mt: "5px", jus: "end", wd: "90%" }}
                onKeyDown={(e: any) => {
                    if (e.code === "Enter") {
                        todo.addSubTask(taskItem, e.target.value);
                        e.target.value = ""
                    }
                }}
            />}
            {
                taskItem._isSubTaskOpen === true && taskItem.subTasks.map((subTask: SubTask) => {
                    return <React.Fragment key={subTask.subTaskId}>
                        <Styler xs={{ ht: "30px", als: "center", d: "grid", wd: "90%", jus: "end", gtc: "20px 1fr", cg: "5px", mb: "4px" }} >
                            <Checkbox checked={subTask.taskStatus === TaskStatus.DONE} onChange={() => todo.toggleTaskStatus(taskItem, subTask)} inputProps={{ 'aria-label': 'controlled' }} size="small" />
                            <Editable text={subTask.taskText} placeholder="Write a task name" type="input" update={() => todo.updateTask(taskItem)} xs={{ als: "center", ht: "20px" }}>
                                <input type="text" name="task" placeholder="Write a task name" value={subTask.taskText} onChange={e => { subTask.taskText = e.target.value; todo.setState({}) }} style={{ width: "100%", boxSizing: "border-box", height: "20px", fontSize: "small" }} />
                            </Editable>
                        </Styler>
                        <Styler as="hr" xs={{ wd: "90%", jus: "end" }}></Styler>
                    </React.Fragment>
                })
            }
        </React.Fragment>
    )
}
const Tags: any = (props: { taskItem: Task, todo: Todo }) => {

    const { taskItem, todo } = props;
    const [selectedTags, setSelectdTags] = useState(taskItem.tags);
    const [allTags, setAllTags] = useState(todo.appState.tags);
    // const taskItem;
    if (taskItem._isTagOpen !== true) {
        return (<></>);
    }

    const selectTag = (tag: Tag) => {
        const selTagIndex = taskItem.tags.findIndex(item => item.name === tag.name);
        if (selTagIndex > -1) {
            taskItem.tags.splice(selTagIndex, 1);
        } else {
            taskItem.tags.push({ name: tag.name });
        }
        // taskItem.tags = [...taskItem.tags];
        // setSelectdTags(taskItem.tags);
        todo.updateTask(taskItem);
    }
    return (
        <React.Fragment>
            {allTags.map(tag => {
                tag._isSelected = (selectedTags.find(selTag => selTag.name === tag.name) !== undefined ? true : false)
            })}
            <Styler xs={{ gac: "max-content", cg: "5px", mt: "5px" }}>
                {allTags.map((tag: Tag, index: number) => {
                    return <Styler xs={{ br: "5px", wd: "40px", bdr: "1px solid #a3a3a3", cr: "pointer", p: "3px", d: "grid", pi: "center", bgc: tag._isSelected === true ? "#bdbcbc" : "#e2e2e2" }} key={index} onClick={() => selectTag(tag)}>
                        <span className="txt">{tag.name}</span>
                    </Styler>
                    // #8fc6f0
                    // return <Button variant="outlined" size="small" onClick={() => { }} key={index} style={{ width: "100%" }}>{tag}</Button>
                })}
            </Styler>


            {taskItem.tags.map((tag: Tag, index: number) => {
                <Styler xs={{ ht: "30px", als: "center", d: "grid", wd: "90%", jus: "end", gac: "20px", cg: "5px", mb: "4px" }} key={index} >
                    <Styler xs={{ br: "5px", ht: "20px", wd: "100%", bdr: "1px solid red" }}>{tag.name}</Styler>
                </Styler>
            })}

        </React.Fragment>

    )
}


function hello() {
    return (<div></div>)
}

