import API from "./api.js";
export const translateCode    = async (code, sourceLanguage, targetLanguage) => (await API.post("/code/translate", { code, sourceLanguage, targetLanguage })).data.data;
export const analyzeComplexity = async (code, language) => (await API.post("/code/analyze",  { code, language })).data.data;
export const optimizeCode     = async (code, language) => (await API.post("/code/optimize", { code, language })).data.data;
export const explainCode      = async (code, language) => (await API.post("/code/explain",  { code, language })).data.data;