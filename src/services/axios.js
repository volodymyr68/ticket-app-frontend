import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
});

export const axiosInstance2 = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});
// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         console.error("Error response:", error);
//         return Promise.reject(error);
//     }
// );