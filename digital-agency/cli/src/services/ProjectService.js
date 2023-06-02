import $host from "../http";

// export default class ProjectService {
//     static fetchProjects(){
//     return $host.get('/projects')
// }

// }

export const createOneProject = async (request) => {
    const {data} = await $host.post('projects/', request)
    return data
}

export const fetchProjects = async () => {
    const {data} = await $host.get('projects')
    return data
}

export const fetchProject = async (id) => {
    const {data} = await $host.get('projects/' + id)
    return data
}
export const fetchMyProjects = async () => {
    const {data} = await $host.get('projects/myProjects')
    return data
}

export const fetchOneProject = async (id) => {
    const {data} = await $host.get('projects/' + id)
    return data
}

export const fetchOneMyProject = async (id) => {
    const {data} = await $host.get('projects/myProject/' + id)
    return data
}

export const updateProject = async (projectUpd) => {
    const {data} = await $host.put('projects/' + projectUpd.id, projectUpd.requestData)
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

export const createCostStage = async (newStagePayment) => {
    const {data} = await $host.put('stages/' + newStagePayment.stageId, {cost: newStagePayment.cost})
    await $host.post('stages/' + newStagePayment.stageId + '/payments')
    return data
}

export const createPaymentStage = async (stageId) => {
    const {data} = await $host.post('stages/' + stageId + '/payments')
    return data.paymentLink
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

export const fetchMyTasksStage = async (id) => {
    const {data} = await $host.get('stages/myStages/' + id)
    return data.tasks
}

