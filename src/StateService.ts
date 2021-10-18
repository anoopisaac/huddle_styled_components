import { AppState, Task, TaskGroup } from "./components/common";
import { messageService } from "./Message";

const state: AppState = new AppState();
export const getState = () => state;

export function setGroupedTask(groupName: string) {
    const tasks = state.tasks;

    if (groupName === "Today") {
        let todayTasks: Task[] = []
        const todayDateTime = new Date(new Date().toDateString()).getTime();
        tasks.forEach(item => {
            const taskDate = new Date(item.dueDate);
            if (taskDate.getTime() === todayDateTime) {
                todayTasks.push(item);
            }
        })
        const group = new TaskGroup("today", "Today", todayTasks);
        state.selectedTaskGroup = group;

    }
}
const url = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?partKey=anoop&project=personal";

export function fetchTasks() {
    fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                state.tasks = result.Items;
                setGroupedTask("Today");
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

