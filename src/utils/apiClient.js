import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://quality-visually-stinkbug.ngrok-free.app",
    withCredentials: true,
    headers: {
        "ngrok-skip-browser-warning": "true",
    },
});

export default apiClient;