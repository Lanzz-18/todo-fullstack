require('dotenv').config(); // Load environment variables from .env file (process.env.PORT, process.env.MONGO_URI, etc)

// If any of these are missing, crash immediately with a clear message
const REQUIRED = [
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET'
];

for(const key of REQUIRED) {
    if(!process.env[key]) { 
        // if any of these keys are missing, stop the server
        console.error(`Error: Missing required environment variable ${key}`);
        console.error(' Add it to your .env file and restart');
        process.exit(1);
    }
}

const config = {
  port:      process.env.PORT      || 5000,
  nodeEnv:   process.env.NODE_ENV  || 'development',
  mongoUri:  process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
 
  jwt: {
    accessSecret:    process.env.JWT_ACCESS_SECRET,
    refreshSecret:   process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN  || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};

module.exports = config;