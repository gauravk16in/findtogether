// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Use relative path for Vercel serverless functions
  : 'http://localhost:4000/api';  // Use localhost for development

export const API_ENDPOINTS = {
  CASES: `${API_BASE_URL}/cases`,
  REPORTS: `${API_BASE_URL}/reports`,
  SIGHTINGS: `${API_BASE_URL}/sightings`
};