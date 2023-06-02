import $host from "./index";


export default class AuthService {
    static async login(email, password) {
    return $host.post('auth/login', {email, password})
}

static async registration(data){
    return $host.post('auth/registrationclient', data)
}

static async logout(){
    return $host.get('auth/logout', {withCredentials: true})
}
}