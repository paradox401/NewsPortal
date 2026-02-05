import api from "./axios";

export const getLatestNews = () =>
  api.get("/public/posts");

export const getSingleNews = (id) =>
  api.get(`/public/posts/${id}`);

export const getNewsByCategory = (category) =>
  api.get(`/public/posts/category/${category}`);

export const searchNews = (params) =>
  api.get("/public/posts/search", { params });

export const getBreakingNews = () =>
  api.get("/public/posts/breaking");

export const getTrendingNews = () =>
  api.get("/public/posts/trending");
