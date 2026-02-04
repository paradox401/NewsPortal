import api from "./axios";

export const getAdminPosts = (params) => api.get("/admin/posts", { params });
export const updateAdminPost = (id, payload) => api.put(`/admin/posts/${id}`, payload);
export const updateAdminPostStatus = (id, payload) => api.put(`/admin/posts/${id}/status`, payload);
export const deleteAdminPost = (id) => api.delete(`/admin/posts/${id}`);
export const uploadAdminPostImages = (id, data) =>
  api.post(`/admin/posts/${id}/images`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAdminStats = () => api.get("/admin/stats");
