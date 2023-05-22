import $host from "../http";

// export default class ProjectService {
//     static fetchProjects(){
//     return $host.get('/projects')
// }

// }

export const fetchProjects = async (id) => {
    const {data} = await $host.get('projects')
    return data
}

export const fetchOneProject = async (id) => {
    const {data} = await $host.get('projects/' + id)
    return data
}
export const deleteOneProject = async (id) => {
    const {data} = await $host.delete('projects/' + id)
    return data
}

export const createOneStage = async (stage) => {
    const {data} = await $host.post('stages/', stage)
    return data
}

export const createOneTask = async (task) => {
    const {data} = await $host.post('tasks/', task)
    return data
}

export const completeOneTask = async (check) => {
    const {data} = await $host.put('tasks/' + check.taskId, {complete: check.complete})
    return data
}

export const deleteOneTask = async (taskId) => {
    const {data} = await $host.delete('tasks/' + taskId)
    return data
}

export const fetchTasksStage = async (id) => {
    const {data} = await $host.get('stages/' + id)
    return data.tasks
}

