export class Task {
    userProject!: string;
    taskId!: string;
    taskText!: string;
    dueDate!: string;
    tags!: Tag[];
    priority!: string;
    isUrgent!: boolean;
    subTasks!: SubTask[];
    duration!: number;
    taskStatus!: TaskStatus;
    _isSubTaskOpen = false;
    _isTagOpen = false;
}
export enum TaskStatus {
    NOTDONE, DONE
}

export enum SortOrder {
    ASC, DESC
}


export class SubTask {
    subTaskId!: string;
    taskText!: string;
    taskStatus!: TaskStatus;
}

// export class TaskDateRange {
//     constructor(public groupId: string, public groupTitle: string) {
//     }
// }

export enum TaskDateRange {
    PREV_DAY = "Previous Day",
    TODAY = "Today",
    TOMORROW = "Tomorrw",
    Next_7_DAYS = "Next 7 days",
    ANY_DAY = "Any day",
}


export enum ClassType {
    TASK = "task",
    PROJECT = "project",
    TAG = "tag",
    USER = "user"
}

export const taskDateRanges = [TaskDateRange.PREV_DAY, TaskDateRange.TODAY, TaskDateRange.TOMORROW, TaskDateRange.Next_7_DAYS, TaskDateRange.ANY_DAY];


export class AppState {
    // tags: Tag[] = [{ name: 'ihcs' }, { name: 'swhr' }];

    selectedTaskDateRange = TaskDateRange.TODAY;
    // tasks: Task[] = [];
    user!: User;
    currProject = new UserProject("official", "official");
    // public tags: Tag[] = [];
    public projects: UserProject[] = [];
    public filteredTasks: Task[] = [];
    public taskFetchStatus: { [projectId: string]: boolean } = {};
    public tasks: { [projectId: string]: Task[] } = {}
    public tags: { [projectId: string]: Tag[] } = {}
    constructor() {

    }

    getCurrentTags = (): Tag[] => {
        return this.tags[this.currProject.id];
    }
    getCurrentProjects = (): UserProject[] => {
        return this.projects;
    }
    getCurrentTasks = (): Task[] => {
        return this.tasks[this.currProject.id];
    }
}

export class User {
    public type = ClassType.USER;
    constructor(public name: string, public id: string, public status: RecordStatus = RecordStatus.ACTIVE) {

    }
}

/**
 * used to identify whether a record is active or deleted. for ex: each tag,project,task etc
 */
export enum RecordStatus {
    ACTIVE, DELETED
}

export class Tag {
    public type = ClassType.TAG;
    constructor(public name: string, public id: string, public _isSelected = false, public createdDate = new Date(), public tagStatus = RecordStatus.ACTIVE) {
    }
}

export class UserProject {
    public type = ClassType.PROJECT;
    constructor(public name: string, public id: string, public _isSelected = false, public createdDate = new Date(), public projStatus = RecordStatus.ACTIVE, public description = "") {
    }
}