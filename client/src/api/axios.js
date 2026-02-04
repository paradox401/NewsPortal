import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // change if deployed
  withCredentials: true,
});

export default api;
