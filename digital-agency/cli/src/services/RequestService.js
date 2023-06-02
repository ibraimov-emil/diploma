import $host from "./index";

export const fetchRequests = async () => {
    const {data} = await $host.get('requests')
    return data
}
export const fetchRequest = async (id) => {
    const {data} = await $host.get('requests/' + id)
    return data
}
export const fetchOneMyRequest = async (id) => {
    const {data} = await $host.get('requests/myRequest/' + id)
    return data
}
export const fetchMyRequests = async () => {
    const {data} = await $host.get('requests/myRequests')
    return data
}

export const fetchServices = async () => {
    const {data} = await $host.get('services')
    return data
}

export const fetchStatuses = async () => {
    const {data} = await $host.get('statuses')
    return data
}

// export const fetchOneProject = async (id) => {
//     const {data} = await $host.get('projects/' + id)
//     return data
// }
export const deleteOneRequest = async (id) => {
    const {data} = await $host.delete('requests/' + id)
    return data
}
//
export const createOneRequest = async (request) => {
    const {data} = await $host.post('requests/', request)
    return data
}
//
// export const createOneTask = async (task) => {
//     const {data} = await $host.post('tasks/', task)
//     return data
// }
//
export const updateRequest = async (requestsUpd) => {
    const {data} = await $host.put('requests/' + requestsUpd.id, requestsUpd.requestData)
    return data
}
//
// export const deleteOneTask = async (taskId) => {
//     const {data} = await $host.delete('tasks/' + taskId)
//     return data
// }
//
