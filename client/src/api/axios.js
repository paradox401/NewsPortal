import axios from "axios";

const api = axios.create({
  baseURL: "https://newsportal-7lo9.onrender.com/api",
  withCredentials: false,
});

export default api;
