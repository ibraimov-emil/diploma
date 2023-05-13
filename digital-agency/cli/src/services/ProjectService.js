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