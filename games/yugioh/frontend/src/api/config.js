// API configuration — monorepo launcher proxies /api/yugioh → yugioh-backend
const API_PREFIX = import.meta.env.VITE_YUGIOH_API || '/api/yugioh'

export const getApiUrl = (endpoint) => `${API_PREFIX}${endpoint}`
