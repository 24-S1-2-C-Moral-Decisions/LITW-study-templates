// Global configuration for all survey projects
// This file centralizes all environment-specific URLs

const config = {
  // Development environment (local)
  development: {
    API_URL: "http://115.146.86.210:3001/",        // Backend API (NestJS)
    MORAL_URL: "http://115.146.86.210:3000/",      // Frontend (Next.js) - default port
    SURVEY_PORT: 8080,                             // Single port for all surveys
    SURVEY_BASE_URL: "http://115.146.86.210:8080/" // Base URL for all surveys
  },
  
  // Production environment (server)
  production: {
    API_URL: process.env.API_URL || "http://115.146.86.210:3001/",   // Backend API
    MORAL_URL: process.env.MORAL_URL || "http://115.146.86.210:3000/", // Frontend
    SURVEY_PORT: 8080,                                               // Single port for all surveys
    SURVEY_BASE_URL: process.env.SURVEY_BASE_URL || "http://115.146.86.210:8080/" // Base URL for all surveys
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export current environment config
module.exports = config[env];
