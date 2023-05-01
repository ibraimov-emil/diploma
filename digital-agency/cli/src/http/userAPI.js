//авторизация, регистрация, проверка токена
import {$authHost, $host} from "./index"
import jwt_decode from 'jwt-decode'

export const registration = async (email, password, phone, surname, name) => {
    // const {data} = await $host.post('api/auth/registration', {email, password, role: 'ADMIN'})
    const {data} = await $host.post('auth/registrationclient', {email, password, phone, surname, name})
    localStorage.setItem('token', data.token)
    // const {client} = await $host.post('auth/registration', {names: "dsad", password, phone, surname, name})
    return jwt_decode(data.token)
}

export const registrationClient = async (email, password, phone, surname, name, description, nameCompany) => {
    // const {data} = await $host.post('api/auth/registration', {email, password, role: 'ADMIN'})
    const {data} = await $host.post('auth/registrationclient', {email, password, phone, surname, name, serviceId: 1, description, nameCompany})
    localStorage.setItem('token', data.token)
    // const {client} = await $host.post('auth/registration', {names: "dsad", password, phone, surname, name})
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    console.log('first')
    const {data} = await $host.post('auth/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth', )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}