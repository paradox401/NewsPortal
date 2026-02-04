import api from "./axios";

export const getUsers = (params) => api.get("/admin/users", { params });
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload);
