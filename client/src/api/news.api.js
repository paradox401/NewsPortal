import api from "./axios";

export const getLatestNews = () =>
  api.get("/public/posts");

export const getSingleNews = (id) =>
  api.get(`/public/posts/${id}`);

export const getNewsByCategory = (category) =>
  api.get(`/public/posts/category/${category}`);

export const searchNews = (query) =>
  api.get(`/public/posts/search?q=${query}`);

export const getBreakingNews = () =>
  api.get("/public/posts/breaking");

export const getTrendingNews = () =>
  api.get("/public/posts/trending");
