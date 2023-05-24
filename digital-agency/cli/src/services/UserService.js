import $host from "../http";

export default class UserService {
    static fetchUsers(){
    return $host.get('/users')
}
}

export const fetchOneUser = async (id) => {
    const {data} = await $host.get('users/' + id)
    return data
}

export const getMyProfile = async () => {
    const {data} = await $host.get('users/me')
    return data
}