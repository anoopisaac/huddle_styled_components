export class Task {
    userProject!: string;
    taskId!: string;
    taskText!: string;
    dueDate!: string;
    tags!: string;
    priority!: string;
    isUrgent!: boolean;
    subTasks!: SubTask[];
    duration!: number;
    taskStatus!: TaskStatus;
    _isSubTaskOpen = false;
}
export enum TaskStatus {
    NOTDONE, DONE
}


export class SubTask {
    subTaskId!: string;
    taskText!: string;
    taskStatus!: TaskStatus;
}

export class TaskGroup {
    constructor(public groupId: string, public groupTitle: string, public tasks: Task[]) {
    }
}

export enum TaskGroupNames {
    PREV_DAY = "Previous Day",
    TODAY = "Today",
    TOMORROW = "Tomorrw",
    Next_7_DAYS = "Next 7 days",
    ANY_DAY = "Any day",
}

export class AppState {
    static taskGroupNames = [TaskGroupNames.PREV_DAY, TaskGroupNames.TODAY, TaskGroupNames.TOMORROW, TaskGroupNames.Next_7_DAYS, TaskGroupNames.ANY_DAY];
    tasks: Task[] = [];
    selectedTaskGroup!: TaskGroup;
}