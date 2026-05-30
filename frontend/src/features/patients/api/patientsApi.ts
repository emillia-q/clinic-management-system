import axios from "axios";

export const patientsApi = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1") + "/patients",
});

patientsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
