import api from "./axios";

export const getCategories = () => api.get("/admin/categories");
export const createCategory = (payload) => api.post("/admin/categories", payload);
export const updateCategory = (id, payload) => api.put(`/admin/categories/${id}`, payload);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);
