import api from "./client";

export const subscribeNewsletter = (email) => api.post("/newsletter/", { email });
