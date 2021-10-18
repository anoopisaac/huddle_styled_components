export class Task {
    userProject!: string;
    taskId!: string;
    taskText!: string;
    dueDate!: string;
    tags!: string;
    priority!: string;
    isUrgent!: boolean;
    subTasks!: SubTask[];
}

export class SubTask {
    taskText!: string;
    status!: string;
}

export class TaskGroup {
    constructor(public groupId: string, public groupTitle: string, public tasks: Task[]) {
    }
}


export class AppState {
    tasks: Task[] = [];
    selectedTaskGroup!: TaskGroup;
}