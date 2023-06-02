import axios from 'axios'

export const API_URL = `http://localhost:5000/`

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

//подставление токена к каждому запросу
const authInterceptor = config => {
    console.log(config)
    // config.headers.authorization = `Bearer ${localStorage.getItem('token')}`

    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$host.interceptors.request.use(authInterceptor)

$host.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (originalRequest.status == 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await $host.get(`${API_URL}auth/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            return $host.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default $host;

export {
    $host,
    $authHost
}