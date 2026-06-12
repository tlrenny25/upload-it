require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Use environment variables for upload/temp directories
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const tempDir = process.env.TEMP_DIR || path.join(__dirname, 'temp');

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://192.168.100.146:3000',
    /^https:\/\/uploadit-frontend\.onrender\.com/,
    /^https:\/\/.*\.onrender\.com/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

console.log(`Upload directory: ${uploadsDir}`);
console.log(`Temp directory: ${tempDir}`);

// Pass directories to routes
app.use('/api/upload', (req, res, next) => {
  req.uploadsDir = uploadsDir;
  req.tempDir = tempDir;
  next();
}, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Upload.IT server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Cleanup expired temporary files every 5 minutes
setInterval(async () => {
  try {
    if (!fs.existsSync(tempDir)) return;
    const files = fs.readdirSync(tempDir);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stat = fs.statSync(filePath);
      const createdTime = stat.birthtime.getTime();
