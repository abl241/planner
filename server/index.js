const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authenticateToken = require('./middleware/auth');


// Middleware
const app = express();
app.use(cors());
app.use(express.json());


// Routes

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Protected routes
const tasksRoutes = require('./routes/tasks');
app.use('/tasks', authenticateToken, tasksRoutes);


const eventRoutes = require('./routes/events');
// app.use('/events', authenticateToken, eventRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});