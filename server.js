const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Upload route
app.use('/api', require('./routes/uploadRoute'));

// Policy routes
app.use('/api/policy', require('./routes/policyRoute'));

// Schedule routes
app.use('/api', require('./routes/scheduleRoute'));

// Start CPU monitoring
require('./utils/cpuMonitor');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

