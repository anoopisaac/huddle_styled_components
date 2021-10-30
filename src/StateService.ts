import { AppState, SortOrder, Task, TaskGroup, TaskGroupNames } from "./common";
import { messageService } from "./Message";

const state: AppState = new AppState();
export const getState = () => state;

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
const url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=personal";

export function fetchTasks(groupName: string) {
    fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                state.tasks = result.Items.sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                setGroupedTask(groupName);
                messageService.sendMessage("done");
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                // this.tasks = [];
            }
        )
}

export function sortTaskFn(sortOrder: SortOrder, tasks: Task[]) {
    return tasks.sort((a, b) => (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * (sortOrder === SortOrder.DESC ? 1 : -1))
}

