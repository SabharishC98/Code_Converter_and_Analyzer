export const parseGeminiJSON = (text) => {
  let clean = text.trim().replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  return JSON.parse(clean.trim());
};
export const cleanCodeResponse = (text) => {
  let clean = text.trim().replace(/^```\w*\s*\n?/, "").replace(/\n?```\s*$/, "");
  return clean.trim();
};