# Survey Projects Deployment Guide

## Overview
This guide explains how to deploy individual survey projects, including local development environment and production server environment.

## Project Structure
```
moral-survey/
├── config.js                    # Global configuration file
└── src/
    ├── moral-survey-1/          # Survey 1 (controversy)
    ├── moral-survey-2/          # Survey 2 (uncertainty)
    ├── moral-survey-3/          # Survey 3 (controversy-uncertainty)
    ├── moral-survey-4/          # Survey 4 (relevant-reasonings)
    └── moral-survey-5/          # Survey 5 (control)
```

## Frontend Environment Variables Configuration

The frontend project requires the following environment variables:

### Development Environment
Add the following to `moral-front-end/.env.local` file:
```bash
# API URL for backend
NEXT_PUBLIC_API_URL=http://localhost:3001/

# Survey URL - this will be overridden in production
NEXT_PUBLIC_SURVEY_URL=http://localhost:8081/
```

### Production Environment
Create `moral-front-end/.env.production` file on the server:
```bash
# API URL for backend
NEXT_PUBLIC_API_URL=http://your-server-ip:3001/

# Survey URL
NEXT_PUBLIC_SURVEY_URL=http://your-server-ip:8081/
```

## Configuration Details

### Project Architecture
This project consists of three independent services:

1. **Frontend** (Next.js) - Frontend application
   - Development environment: `http://localhost:3000/`
   - Production environment: `http://your-server-ip:3000/`

2. **Backend** (NestJS) - Backend API
   - Development environment: `http://localhost:3001/`
   - Production environment: `http://your-server-ip:3001/`

3. **Survey** (Unified service) - Survey application
   - Development environment: `http://localhost:8080/`
   - Production environment: `http://your-server-ip:8080/`
   - Different surveys accessed via paths:
     - Survey 1: `http://localhost:8080/moral-survey-1/`
     - Survey 2: `http://localhost:8080/moral-survey-2/`
     - Survey 3: `http://localhost:8080/moral-survey-3/`
     - Survey 4: `http://localhost:8080/moral-survey-4/`
     - Survey 5: `http://localhost:8080/moral-survey-5/`

### config.js Configuration File
This is the core configuration file containing all environment-related URLs and port settings:

```javascript
const config = {
  // Development environment (local)
  development: {
    API_URL: "http://localhost:3001/",        // Backend API address (NestJS)
    MORAL_URL: "http://localhost:3000/",      // Frontend address (Next.js)
    SURVEY_PORTS: {
      survey1: 8081,
      survey2: 8082,
      survey3: 8083,
      survey4: 8084,
      survey5: 8085
    }
  },
  
  // Production environment (server)
  production: {
    API_URL: "http://your-server-ip:3001/",   // Replace with actual backend server IP
    MORAL_URL: "http://your-server-ip:3000/", // Replace with actual frontend server IP
    SURVEY_PORTS: {
      survey1: 8081,
      survey2: 8082,
      survey3: 8083,
      survey4: 8084,
      survey5: 8085
    }
  }
};
```

## Fixed localhost References

All localhost references in the following files have been fixed and are now managed through config.js:

### ✅ Fixed Files
1. **All webpack.config.js files** - Using global configuration
2. **All package.json files** - Removed proxy configuration
3. **GitHub Actions CI configuration** - Using environment variables
4. **litw.utils.0.2.js** - Injecting API_URL through webpack
5. **litw.data.2.0.0.js** - Using MoralBaseURL configuration
6. **All study-model.js files** - Setting MoralBaseURL
7. **All index.js files** - Using MORAL_URL variable

### 🔧 Fix Methods
- **webpack configuration**: Injecting environment variables through DefinePlugin
- **package.json**: Removing hardcoded proxy configuration
- **CI/CD**: Using NODE_ENV environment variable
- **Utility files**: Injecting API_URL through webpack
- **study-model.js**: Setting MoralBaseURL uniformly
- **index.js**: Using MORAL_URL instead of hardcoded URLs

## Individual Survey Project Deployment

### Local Development Environment

1. **Navigate to specific survey project directory**
   ```bash
   cd moral-survey/src/moral-survey-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build project**
   ```bash
   npm run publish
   ```

4. **Start development server**
   ```bash
   npm run devserver
   ```

5. **Access addresses**
   - Survey 1: http://localhost:8081
   - Survey 2: http://localhost:8082
   - Survey 3: http://localhost:8083
   - Survey 4: http://localhost:8084
   - Survey 5: http://localhost:8085

### Production Server Environment

1. **Modify configuration file**
   Edit `moral-survey/config.js` file and replace `your-server-ip` with the actual server IP address.

2. **Build project**
   ```bash
   cd moral-survey/src/moral-survey-1
   NODE_ENV=production npm run publish
   ```

3. **Deploy to server**
   Upload the built files to the server and configure the corresponding ports using a web server (such as nginx).

## Important Notes

- Each survey project is independent and can be deployed separately
- Ensure that frontend and backend services are started
- Check that CORS configuration is correct
- Ensure database connection is normal