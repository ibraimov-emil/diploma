import $host from "./index";
export const fetchEmployees = async (id) => {
    const {data} = await $host.get('employees')
    return data
}

export const fetchOneEmployee = async (id) => {
    const {data} = await $host.get('employees/' + id)
    return data
}
export const deleteOneEmployee = async (id) => {
    const {data} = await $host.delete('employees/' + id)
    return data
}
