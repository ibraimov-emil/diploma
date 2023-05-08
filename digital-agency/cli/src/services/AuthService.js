import $host, {$authHost} from "../http";
import {AxiosResponse} from 'axios';

export default class AuthService {
    static async login(email, password) {
    return $host.post('auth/login', {email, password})
}

static async registration(email, password, phone, surname, name, description, nameCompany){
    return $host.post('auth/registrationclient', {email, password, phone, surname, name, serviceId: 1, description, nameCompany})
}

static async logout(){
    return $host.get('auth/logout', {withCredentials: true})
}
}