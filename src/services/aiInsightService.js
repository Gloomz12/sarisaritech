import api from "./api";

// FORECAST
export const getForecast = async (days = 7) => {
  const response = await api.get(`/ai-insights/forecast?days=${days}`);

  return response.data;
};

// APRIORI
export const getApriori = async () => {
  const response = await api.get("/ai-insights/apriori");

  return response.data;
};

// GEMINI
export const getGeminiInsights = async () => {
  const response = await api.get("/ai-insights/gemini");

  return response.data;
};

// RESTOCK
export const getRestockRecommendations = async () => {
  const response = await api.get("/ai-insights/restock");

  return response.data;
};
