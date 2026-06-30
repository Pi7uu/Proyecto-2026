import api from "./client";

export const getOrders = () => api.get("/ordenes/");
export const createOrder = (data) => api.post("/ordenes/", data);
export const getOrder = (id) => api.get(`/ordenes/${id}/`);
