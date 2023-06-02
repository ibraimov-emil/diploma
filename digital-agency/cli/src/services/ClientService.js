import $host from "./index";
export const fetchClients = async (id) => {
    const {data} = await $host.get('clients')
    return data
}

export const fetchOneClient = async (id) => {
    const {data} = await $host.get('clients/' + id)
    return data
}
export const deleteOneClient = async (id) => {
    const {data} = await $host.delete('clients/' + id)
    return data
}