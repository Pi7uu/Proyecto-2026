import api from "./client";

export const getAuthStatus = () => api.get("/auth/status/");
export const login = (data) => api.post("/auth/login/", data);
export const register = (data) => api.post("/auth/register/", data);
export const logout = () => api.post("/auth/logout/");
