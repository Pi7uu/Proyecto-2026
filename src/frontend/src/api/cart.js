import api from "./client";

export const getCart = () => api.get("/carrito/");
export const addToCart = (productId, data) => api.post(`/carrito/agregar/${productId}/`, data);
export const removeFromCart = (productId, size) => api.delete(`/carrito/remover/${productId}/`, { params: { size } });
