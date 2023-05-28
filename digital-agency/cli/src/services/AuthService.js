import $host, {$authHost} from "../http";
import {AxiosResponse} from 'axios';

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