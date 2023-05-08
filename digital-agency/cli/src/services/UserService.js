import $host from "../http";

export default class UserService {
    static fetchUsers(){
    return $host.get('/users')
}
}