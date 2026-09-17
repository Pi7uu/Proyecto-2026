import api from "./client";

export const getProducts = (params) => api.get("/productos/", { params });
export const getProduct = (slug) => api.get(`/productos/${slug}/`);
