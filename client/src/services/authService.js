import API from "./api.js";
export const register    = async (name, email, password) => (await API.post("/auth/register", { name, email, password })).data.data;
export const emailLogin  = async (email, password)       => (await API.post("/auth/login",    { email, password })).data.data;
export const googleLogin = async (credential)            => (await API.post("/auth/google",   { credential })).data.data;
export const getMe       = async ()                      => (await API.get("/auth/me")).data.data;
export const logout      = async ()                      => (await API.post("/auth/logout")).data;