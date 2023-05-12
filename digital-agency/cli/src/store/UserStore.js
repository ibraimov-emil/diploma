import {makeAutoObservable} from "mobx";
import axios from "axios";
import AuthService from "../services/AuthService";
import Cookies from 'js-cookie';
import $host from "../http";

class UserStore{

    user = {}
    isAuth = false;
    isLoading = false;
    constructor() {

        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this.isAuth = bool
    }

    setUser(user){
        this.user = user
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    // get isAuth(){
    //     return this._isAuth
    // }
    // get User(){
    //     return this._user
    // }

    async login(email, password ) {

            const response = await AuthService.login(email, password);
            Cookies.set('userId', response.data.user.id, { expires: 30 * 24 * 60 * 60 * 1000 });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 * 24 * 60 * 60 * 1000 });
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUser(response.data.user);
    }

    async registration(email, password, phone, surname, name, description, nameCompany) {
        try {
            const response = await AuthService.registration(email, password, phone, surname, name, description, nameCompany);
            Cookies.set('userId', response.data.user.id, { expires: 30 * 24 * 60 * 60 * 1000 });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 * 24 * 60 * 60 * 1000 });
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            Cookies.remove('userId');
            Cookies.remove('refreshToken');
            this.setIsAuth(false);
            this.setUser({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await $host.get(`${process.env.REACT_APP_API_URL}auth/refresh`, {withCredentials: true})
            console.log(response.data)
            Cookies.set('userId', response.data.user.id, { expires: 30 * 24 * 60 * 60 * 1000 });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 * 24 * 60 * 60 * 1000 });
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}

export default UserStore;