require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const caseRoutes = require('./routes/caseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/cases', caseRoutes);

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found.'
  });
});

// Centralized Error Handling Middleware (SPEC Section 25)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message
  });
});

// Database connection logic with automatic in-memory fallback for local dev
async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mystery_ai';

  try {
    // Attempt standard connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected successfully to MongoDB at ${uri}`);
  } catch (initialErr) {
    console.warn(`[Database] Standard MongoDB connection failed (${initialErr.message}).`);
    try {
      // Fallback to MongoMemoryServer for seamless zero-config local development
      console.log('[Database] Initializing MongoMemoryServer fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to in-memory MongoDB (${memUri}). App is 100% ready to use!`);
    } catch (memErr) {
      console.error('[Database] Critical: Failed to initialize in-memory database:', memErr.message);
    }
  }
}

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🕵️ Mystery Investigation AI Server running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Allowed Client: ${CLIENT_URL}`);
    console.log(`=========================================`);
  });
});

module.exports = app;
