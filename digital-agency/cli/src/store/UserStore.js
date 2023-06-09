import {makeAutoObservable} from "mobx";
import axios from "axios";
import AuthService from "../services/AuthService";
import Cookies from 'js-cookie';
import $host from "../services";

class UserStore{


    constructor() {
        this.user = {}
        this.isAuth = false;
        this.isClient = false;
        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this.isAuth = bool
    }

    setIsClient(bool){
        this.isClient = bool
    }

    setUser(user){
        this.user = user
    }

    // get isAuth(){
    //     return this._isAuth
    // }
    get User(){
        return this.user
    }

    async login(email, password ) {
            const response = await AuthService.login(email, password);
            Cookies.set('userId', response.data.user.id, { expires: 30 * 24 * 60 * 60 * 1000 });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 * 24 * 60 * 60 * 1000 });
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUser(response.data.user);
            if (response.data.user.client){
                this.setIsClient(true)
            }
    }

    async registration(email, password, phone, surname, name, description, nameCompany) {
        // try {
            const response = await AuthService.registration(email, password, phone, surname, name, description, nameCompany);
            Cookies.set('userId', response.data.user.id, { expires: 30 * 24 * 60 * 60 * 1000 });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 * 24 * 60 * 60 * 1000 });
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            if (response.data.user.client.id){
                this.setIsClient(true)
            }
            this.setUser(response.data.user);
        // } catch (e) {
        //     console.log(e.response?.data?.message);
        // }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            Cookies.remove('userId');
            Cookies.remove('refreshToken');
            this.setIsAuth(false);
            this.setIsClient(false)
            this.setUser({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        try {
            const response = await $host.get(`${process.env.REACT_APP_API_URL}auth/refresh`, {withCredentials: true})
            console.log(response.data)
            Cookies.set('userId', response.data.user.id, { expires: 30 * 24 * 60 * 60 * 1000 });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 * 24 * 60 * 60 * 1000 });
            localStorage.setItem('token', response.data.accessToken);
            if (response.data.user.client){
                this.setIsClient(true)
            }
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
}

export default UserStore;