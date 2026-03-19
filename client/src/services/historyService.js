import API from "./api.js";
export const getHistory       = async (page=1, limit=10) => (await API.get(`/history?page=${page}&limit=${limit}`)).data.data;
export const deleteHistoryItem = async (id) => (await API.delete(`/history/${id}`)).data;
export const clearHistory     = async ()   => (await API.delete("/history/clear")).data;