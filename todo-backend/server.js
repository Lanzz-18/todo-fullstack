const config = require('./config/env') // Load environment variables and validate them (MONGO_URI, JWT secrets, etc)

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');

const app = express()

connectDB() // connecting to MongoDB

// Middleware
app.use(cors({ 
    origin: config.clientUrl, 
    credentials: true 
}));

app.use(express.json())
app.use(cookieParser()) // for parsing cookies in requests

// Routes defined
app.get('/', (req, res) => {
    res.send('Server is running')
})
app.use('/api/auth', authRoutes)
app.use('/api/todos/', todoRoutes)

app.use((err, req, res, next) => {
  console.error('ERROR STACK:', err.stack);
  res.status(500).json({ message: err.message });
});

// error handling
app.use(errorHandler)

// config.port instead of process.env.PORT
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
 