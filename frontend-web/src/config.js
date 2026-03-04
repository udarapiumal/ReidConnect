// Central configuration for the frontend-web app.
// The base URL is read from the REACT_APP_API_BASE_URL environment variable,
// which is set in .env (development) and .env.production (production builds).
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
