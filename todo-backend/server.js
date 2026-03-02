const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todos')

const app = express()
app.use(cors()) // enabling CORS for all routes
app.use(express.json())
 
// Connecting to mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

// Routes defined
app.get('/', (req, res) => {
    res.send('Server is running')
})
app.use('/api/auth', authRoutes)
app.use('/api/todos/', todoRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

