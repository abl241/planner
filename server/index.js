const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const { authenticateToken } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const eventRoutes = require('./routes/events');

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', authRoutes);
// Protected routes
app.use('/tasks', authenticateToken, taskRoutes);
app.use('/events', authenticateToken, eventRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});