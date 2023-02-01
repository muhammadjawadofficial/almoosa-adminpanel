import { axios, controller, source } from './services/axios';
import { userService } from './services';
import router from './router';

export default function setup() {
    axios.interceptors.request.use(function (config) {
        const token = userService.getToken();
        config.signal = controller.signal;
        config.cancelToken = source.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (process.env.NODE_ENV !== "production") {
            config.headers['bypass-tunnel-reminder'] = true
        }
        return config;
    }, function (err) {
        return Promise.reject(err);
    });
    axios.interceptors.response.use(function (response) {
        if (response.status == 401) {
            userService.removeLoginInfo();
            router.push({ name: "Login Dashboard" })
        }
        return response;
    }, function (error) {
        if (error.response.status == 401) {
            userService.removeLoginInfo();
            router.push({ name: "Login Dashboard" })
        }
        return Promise.reject(error);
    })
}