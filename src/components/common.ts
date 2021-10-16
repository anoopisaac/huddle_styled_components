export class Task{
    userProject!: string;
    taskId!: string;
    taskText!: string;
    dueDate!: string;
    tags!: string;
    priority!: string;
    subTasks!: SubTask[];
}

export class SubTask{
    taskText!: string;
    status!: string;
}

export class TaskGroup{
    groupId!: string;
    groupTitle!: string;
    tasks!: Task[];
}