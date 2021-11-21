import { AppState, ClassType, SortOrder, Tag, Task, TaskDateRange, User, UserProject } from "./common";
import { messageService } from "./Message";

const url = `https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo`;

let state: AppState = new AppState();
export const getState = () => state;

export async function initState() {
    // const uniqueTagId = generateRandomId();
    // const tag1: Tag = new Tag("swhr", (generateRandomId()));
    // const tag2: Tag = new Tag("ihcs", (generateRandomId()));
    state.user = new User("anoop", "aisaac");
    state.currProject = new UserProject("ihcs", "ihcs");
    const tags = await fetchTags();
    const tasks = await fetchTasks(state.user, state.currProject);
    state.tags[state.currProject.id] = tags;
    state.tasks[state.currProject.id] = tasks;
    messageService.sendMessage("done");
}



export function generateRandomId() {
    return Math.round(Math.random() * 1000000000000000) + "";
}
export async function fetchTags() {
    const tagUrl = `${url}/tag?user=${state.user.id}&project=${state.currProject.id}`;
    const start = (new Date().getTime());
    const tagItems: any[] = (await fetchItems(tagUrl));
    const end = (new Date().getTime());
    console.log("time:", (end - start));

    const tags: Tag[] = tagItems.map(itr => itr.MapAttribute);
    console.log(Object.getOwnPropertyNames(new Tag("", "")));
    return tags;
}
export async function fetchTasks(user: User, project: UserProject) {
    const tagUrl = `${url}/?user=${user.id}&project=${project.id}`;
    const start = (new Date().getTime());
    const taskItems: any[] = (await fetchItems(tagUrl));
    const end = (new Date().getTime());
    console.log("time:", (end - start));

    const tasks: Task[] = taskItems.map(itr => itr.MapAttribute);
    // console.log(Object.getOwnPropertyNames(new Tag("", "")));
    return tasks;
}

export async function insertUpdateRemoteTask(isInsert: boolean, task: Task, user: User, project: UserProject) {
    // const taskId = Math.round(Math.random() * 10000000000);
    const response = await fetch(`${url}/?user=${user.id}&project=${project.id}`, {
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

export function fetchItems(url: string) {
    return fetch(url).then(res => res.json()).then((result) => result.Items)
}
export async function pushItem(item: Tag | UserProject, isInsert: boolean) {
    // const postData = { ...tag, user: "anoop" }
    // const taskId = Math.round(Math.random() * 10000000000);
    // const urlSuffix=(item.type===ClassType.TAG)
    const response = await fetch(`${url}/${item.type}?user=${state.user.id}`, {
        method: isInsert ? 'POST' : 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
    const data = await response.text();
    // enter you logic when the fetch is successful
    console.log(data);
}


export async function getFilteredTask() {
    if (state.taskFetchStatus[state.currProject.id] !== undefined) {
        state.tasks[state.currProject.id] = await fetchTasks(state.user, state.currProject)
    }
    const tasks = state.tasks[state.currProject.id];
    let filteredTasks: Task[] = []
    const todayDateTime = new Date(new Date().toDateString()).getTime();
    if (state.selectedTaskDateRange === TaskDateRange.TODAY) {
        filteredTasks = tasks.filter(item => {
            const taskDate = new Date(item.dueDate);
            return taskDate.getTime() === todayDateTime
        })
    } else if (state.selectedTaskDateRange === TaskDateRange.ANY_DAY) {
        filteredTasks = tasks;
    }
    return filteredTasks;
}

// export function fetchTasks(projectId: string) {
//     const fetchTasksUrl = "https://jukk3718ad.execute-api.us-east-1.amazonaws.com/beta/todo?user=anoop&project=ihcs";
//     fetch(fetchTasksUrl)
//         .then(res => res.json())
//         .then(
//             (result) => {
//                 state.tasks = result.Items.sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
//                 state.tasks.forEach((task: any) => {
//                     task.userProject = task['partKey'];
//                     task.taskId = task['id'];
//                 })
//                 console.log(state.tasks);
//                 getFilteredTask(groupName);
//                 messageService.sendMessage("done");
//             },
//             (error) => {
//                 // this.tasks = [];
//             }
//         )
// }

export function sortTaskFn(sortOrder: SortOrder, tasks: Task[]) {
    return tasks.sort((a, b) => (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * (sortOrder === SortOrder.DESC ? 1 : -1))
}

export function populateObject<Type>(data: any) {
    let properties: string[] = [];
    return data.MapAttribute
    // const assignedObject: any = {};
    // switch (data.classType) {
    //     case ClassType.TASK: {
    //         const tag = new Tag("", "");
    //         properties = Object.getOwnPropertyNames(tag);
    //         break;
    //     }
    // }
    // properties.forEach(itr => {
    //     console.log("erere");
    //     assignedObject
    // })
}