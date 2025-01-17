import { Styler } from './styles/Grid.styled'
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TodoForm from './TodoForm';
import { AppState, SortOrder, SubTask, Tag, Task, TaskDateRange, TaskStatus, User, UserProject } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faTag } from '@fortawesome/free-solid-svg-icons';
import './styles/common.scss'
import { fetchTasks, generateRandomId, getFilteredTask, getState, insertUpdateRemoteTask, sortTaskFn } from '../StateService';
import { messageService } from '../Message';
import { Subscription } from 'rxjs';
import Editable from './Editable';
import { Button, Checkbox } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HighlightSpanKind } from 'typescript';
import { toUSVString } from 'util';


declare var window: any;

export class Todo extends React.Component {
    appState!: AppState;
    editTask: Task | undefined = undefined;
    filteredTasks: Task[] = [];
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
        this.subscription = messageService.getMessage().subscribe(async data => {
            // console.log(this.appState?.selectedTaskGroup.tasks, "eeeee");
            this.filteredTasks = await getFilteredTask();
            this.setState({});
        })
        window['ee'] = this;
    }
    async componentDidUpdate() {
        // this.filteredTasks = await getFilteredTask();
    }
    componentWillUnmount() {
        this.subscription?.unsubscribe();
    }
    updateTask = (task: Task) => {
        console.log(task);
        const currProject = this.appState.currProject;
        const existTask = this.filteredTasks.find(item => item.taskId === task.taskId)
        // const selectedTaskGroup = this.appState.selectedTaskGroup;
        if (existTask === undefined) {
            insertUpdateRemoteTask(true, task, this.appState.user, currProject);
            this.appState.tasks[currProject.id].unshift(task);
            this.filteredTasks.unshift(task);
        } else {
            // setCurrTask(data);
            // todos.find(todo=>todo.task_id===data.task_id)
            this.filteredTasks = this.filteredTasks.map((item) => {
                return item.taskId === task.taskId ? task : item
            });
            insertUpdateRemoteTask(false, task, this.appState.user, currProject);
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
        newTask.subTasks = [];
        // newTask.subTasks = [{ taskText: "", taskStatus: TaskStatus.NOTDONE, subTaskId: this.generateRandomId() }];
        newTask.tags = [];
        newTask.taskId = generateRandomId();
        newTask.userProject = "anoop#personal"
        newTask.isUrgent = false;
        newTask.duration = 10;
        newTask.taskStatus = TaskStatus.NOTDONE;
        return newTask;
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
        // const selectedTaskGroup = this.appState?.selectedTaskGroup
        this.currentSortOrder = this.currentSortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;
        this.filteredTasks = sortTaskFn(this.currentSortOrder, this.filteredTasks);
        this.setState({});
    }
    onDurationBlur = (task: Task) => {
        this.updateTask(task);
    }
    addTag = (task: Task, name: string) => {
        const tag: Tag = new Tag(name, (generateRandomId()));
        task.tags.push(tag);
        this.setState({})
    }
    addSubTask = (task: Task, taskText: string) => {
        task.subTasks.push({ subTaskId: generateRandomId(), taskText, taskStatus: TaskStatus.NOTDONE });
        this.updateTask(task);
    }
    render() {
        const filteredTasks = this.filteredTasks;
        return (
            <Styler className="task-group-container" xs={{ gtc: "700px 1fr" }}>
                <Modal trigger={this.editTask} close={() => this.closeModal()} width="600px" height="300px">
                    <TodoForm updateTask={this.updateTask} task={this.editTask} />
                </Modal>
                {
                    (filteredTasks &&
                        <Styler xs={{ gar: "30px 40px 1fr", br: "5px", p: "10px" }} className="task-group">
                            <Styler xs={{ gtc: "max-content 1fr max-content" }}>
                                <Styler as="span" als="center" className="txt title">{'today'}</Styler>
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
                                {filteredTasks.map(taskItem =>
                                    <Styler key={taskItem.taskId} xs={{ gar: "max-content" }}>
                                        <Styler xs={{ gtc: "10px 20px 1fr 40px 75px 10px 10px", gta: "'down-arrow check task duration date priority tag'", cg: "5px", mb: "4px", d: "grid", ai: "center", ht: "30px" }} className="task">
                                            {< FontAwesomeIcon icon={taskItem._isSubTaskOpen === true ? faAngleUp : faAngleDown} className="awesome-icon" style={{ gridArea: "down-arrow", cursor: "pointer" }} onClick={() => this.toggleSubTask(taskItem)} />}
                                            {taskItem.subTasks.length == 0 && <div style={{ gridArea: "down-arrow" }}></div>}
                                            <Checkbox checked={taskItem.taskStatus === TaskStatus.DONE} onChange={() => this.toggleTaskStatus(taskItem, taskItem)} inputProps={{ 'aria-label': 'controlled' }} style={{ gridArea: "check" }} size="small" />
                                            <Styler xs={{ mw: "600px", ga: "task" }}>
                                                <Editable text={taskItem.taskText} type="input" update={() => this.updateTask(taskItem)}>
                                                    <Styler as="input" type="text" name="taskText" placeholder="Task" value={taskItem.taskText} onChange={(e: any) => this.onChange(e, taskItem)} xs={{ wd: "100%", bs: "border-box", ht: "23px", fs: "small", bdr: "1px solid #ced4da", pl: "3px", br: "3px" }} />
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
                                        <Tags taskItem={taskItem} todo={this} tags={this.appState.tags}></Tags>
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
                                <Styler as="input" type="text" name="task" placeholder="Write a task name" value={subTask.taskText} onChange={(e: any) => { subTask.taskText = e.target.value; todo.setState({}) }} xs={{ wd: "100%", bs: "border-box", fs: "small", ht: "23px", bdr: "1px solid #ced4da", pl: "3px", br: "3px" }} />
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
    const [allTags, setAllTags] = useState(todo.appState.getCurrentTags());

    useEffect(() => {
        console.log("werere");
        setAllTags(todo.appState.getCurrentTags())
    }, [taskItem._isTagOpen])
    // const taskItem;
    if (taskItem._isTagOpen !== true) {
        return (<></>);
    }
    const selectTag = (tag: Tag) => {
        const selTagIndex = taskItem.tags.findIndex(item => item.name === tag.name);
        if (selTagIndex > -1) {
            taskItem.tags.splice(selTagIndex, 1);
        } else {
            const newTag = new Tag(tag.name, generateRandomId())
            taskItem.tags.push(newTag);
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
                {allTags.map((tag: Tag) => {
                    return <Styler xs={{ br: "5px", wd: "40px", bdr: "1px solid #a3a3a3", cr: "pointer", p: "3px", d: "grid", pi: "center", bgc: tag._isSelected === true ? "#bdbcbc" : "#e2e2e2" }} key={tag.id} onClick={() => selectTag(tag)}>
                        <span className="txt">{tag.name}</span>
                    </Styler>
                    // #8fc6f0
                    // return <Button variant="outlined" size="small" onClick={() => { }} key={index} style={{ width: "100%" }}>{tag}</Button>
                })}
            </Styler>
        </React.Fragment>

    )
}

class InlineInput extends React.Component<any> {
    xs: {} = { wd: "100%", bs: "border-box", ht: "23px", fs: "small", bdr: "1px solid #ced4da", pl: "3px", br: "3px" };
    constructor(props: any) {
        super(props);
        this.xs = this.props.xs !== undefined ? this.props.xs : this.xs;

    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    render() {
        return (
            <Styler type={this.props.text} name={this.props.name} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange} xs={this.props.xs} as="input">
            </Styler>
        );
    }
}


export default Todo;


function hello() {
    return (<div></div>)
}

