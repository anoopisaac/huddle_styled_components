import { AppState, SortOrder, Tag, Task, TaskGroup, TaskGroupNames } from "./common";
import { messageService } from "./Message";

let state: AppState = new AppState();
export const getState = () => state;

export async function initState() {
    // const uniqueTagId = generateRandomId();
    const tag1: Tag = new Tag("swhr", (generateRandomId()));
    const tag2: Tag = new Tag("ihcs", (generateRandomId()));
    state.tags = await fetchTags();
}


export function generateRandomId() {
    return Math.round(Math.random() * 1000000000000000) + "";
}
export async function fetchTags() {
    const tagUrl = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo/tag?user=anoop";
    const tags: Tag[] = await fetchItems(tagUrl);
    return tags;
}

export function fetchItems(url: string) {
    return fetch(url).then(res => res.json()).then((result) => result.Items)

}

export function setGroupedTask(groupName: string) {
    const tasks = state.tasks;

    let filteredTasks: Task[] = []
    const todayDateTime = new Date(new Date().toDateString()).getTime();
    if (groupName === TaskGroupNames.TODAY) {
        filteredTasks = tasks.filter(item => {
            const taskDate = new Date(item.dueDate);
            return taskDate.getTime() === todayDateTime
        })
    } else if (groupName === TaskGroupNames.ANY_DAY) {
        filteredTasks = tasks;
    }
    const group = new TaskGroup("today", "Today", filteredTasks);
    state.selectedTaskGroup = group;
}

export function fetchTasks(groupName: string) {
    const fetchTasksUrl = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=personal";
    fetch(fetchTasksUrl)
        .then(res => res.json())
        .then(
            (result) => {
                state.tasks = result.Items.sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                state.tasks.forEach((task: any) => {
                    task.userProject = task['partKey'];
                    task.taskId = task['id'];
                })
                console.log(state.tasks);
                setGroupedTask(groupName);
                messageService.sendMessage("done");
            },
            (error) => {
                // this.tasks = [];
            }
        )
}

export function sortTaskFn(sortOrder: SortOrder, tasks: Task[]) {
    return tasks.sort((a, b) => (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * (sortOrder === SortOrder.DESC ? 1 : -1))
}

