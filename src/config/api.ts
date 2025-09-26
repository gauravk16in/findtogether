// API Configuration
export const API_BASE_URL = '/api';  // Always use relative path for Vercel serverless functions

export const API_ENDPOINTS = {
  CASES: `${API_BASE_URL}/cases`,
  REPORTS: `${API_BASE_URL}/reports`,
  SIGHTINGS: `${API_BASE_URL}/sightings`
};