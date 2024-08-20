import axios from "axios";

const $axios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
    }
});

export default $axios;