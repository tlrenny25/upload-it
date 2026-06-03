require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

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
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Routes
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Upload.IT server is running' });
});

// Cleanup expired temporary files every 5 minutes
setInterval(async () => {
  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stat = fs.statSync(filePath);
      const createdTime = stat.birthtime.getTime();
      const expirationTime = parseInt(file.split('_')[0]) || 0;

      if (now > createdTime + expirationTime) {
        fs.unlinkSync(filePath);
        console.log(`Deleted expired file: ${file}`);
      }
    }
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Upload.IT server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
