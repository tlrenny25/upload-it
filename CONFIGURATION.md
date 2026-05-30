# Upload.IT - Configuration & Advanced Setup

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: CORS settings (future)
CORS_ORIGIN=http://localhost:3000

# Optional: File storage settings (future)
MAX_FILE_SIZE=1073741824  # 1 GB in bytes
UPLOAD_DIR=./uploads
TEMP_DIR=./temp

# Optional: NSFW Detection (future)
ENABLE_NSFW_CHECK=false
NSFW_MODEL=mobilenet
```

### Frontend (.env)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## File Upload Configuration

### Current Limits

| Setting | Value | Unit |
|---------|-------|------|
| Max File Size | 1 | GB |
| Min Expiration | 1 | Minute |
| Max Expiration | 525,600 | Minutes (1 year) |
| Cleanup Interval | 5 | Minutes |

### Blocked File Extensions

```javascript
['.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.vbs', '.js']
```

To modify, edit: `backend/middleware/validation.js`

---

## Storage Management

### Directory Structure

```
backend/
├── uploads/           # Permanent files
│   ├── [timestamp]_[uuid]_filename.ext
│   └── ...
├── temp/              # Temporary files (auto-cleanup)
│   ├── [expiration]_[timestamp]_[uuid]_filename.ext
│   └── ...
```

### Storage Cleanup

**Current:** Runs every 5 minutes (in `server.js`)

To change cleanup interval:
```javascript
// In server.js, line ~55
setInterval(async () => {
  // cleanup code
}, 5 * 60 * 1000);  // Change 5 to desired minutes
```

---

## CORS Configuration

### Current (Allow All)

```javascript
// In server.js
app.use(cors());
```

### Restrict to Specific Origin

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

---

## Performance Optimization

### Multer Configuration

Current limits (in `backend/routes/upload.js`):
```javascript
multer({ 
  storage, 
  limits: { fileSize: 1024 * 1024 * 1024 } 
})
```

To change max file size:
```javascript
// Change 1024 * 1024 * 1024 to desired size in bytes
// Examples:
// 500 MB: 500 * 1024 * 1024
// 2 GB: 2 * 1024 * 1024 * 1024
```

### Stream Processing (Future Enhancement)

For very large files, implement stream processing:
```javascript
app.post('/api/upload/file-stream', (req, res) => {
  const stream = fs.createWriteStream(filePath);
  req.pipe(stream);
  // Handle stream events
});
```

---

## Database Integration (Future)

### MongoDB Example

```bash
npm install mongoose
```

```javascript
// backend/models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  size: Number,
  uploadedAt: Date,
  expiresAt: Date,
  temporary: Boolean,
  userId: String,
  mimeType: String
});

module.exports = mongoose.model('File', fileSchema);
```

### PostgreSQL Example

```bash
npm install pg sequelize
```

---

## Authentication (Future)

### JWT Setup

```bash
npm install jsonwebtoken bcryptjs
```

```javascript
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

---

## NSFW Detection (Future)

### NSFW Detection Services

**Option 1: TensorFlow.js with NSFW Model**
```bash
npm install @tensorflow/tfjs-coco-ssd @tensorflow/tfjs
```

**Option 2: OpenAI Vision API**
```javascript
const openai = require('openai');

async function checkNSFW(imagePath) {
  const response = await openai.createImageVariation({
    // implementation
  });
  // Check if NSFW
}
```

**Option 3: Clarifai API**
```bash
npm install clarifai
```

---

## Docker Configuration (Future)

### Dockerfile

```dockerfile
# Backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/temp:/app/temp

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## Logging Configuration (Future)

### Winston Logger Setup

```bash
npm install winston
```

```javascript
// backend/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'upload-it' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

---

## SSL/TLS Configuration (Production)

```javascript
// backend/server.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server running on port 443');
});
```

---

## Rate Limiting (Future)

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Monitoring & Analytics (Future)

### Google Analytics Integration (Frontend)

```bash
npm install react-ga
```

### Server Monitoring with PM2

```bash
npm install -g pm2
pm2 start backend/server.js --name "uploadit-backend"
pm2 start frontend/start --name "uploadit-frontend"
pm2 monit
```

---

## Testing Configuration (Future)

### Jest Setup

```bash
npm install --save-dev jest supertest
```

### Example Test

```javascript
// backend/tests/upload.test.js
const request = require('supertest');
const app = require('../server');

describe('File Upload API', () => {
  it('should upload a file', async () => {
    const response = await request(app)
      .post('/api/upload/file')
      .attach('file', 'path/to/test-file.txt');
    
    expect(response.status).toBe(200);
  });
});
```

---

## CDN Integration (Future)

### AWS S3 Configuration

```bash
npm install aws-sdk
```

```javascript
// backend/services/s3.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const uploadToS3 = (file) => {
  return s3.upload({
    Bucket: process.env.S3_BUCKET,
    Key: file.filename,
    Body: file.buffer
  }).promise();
};

module.exports = uploadToS3;
```

---

## Production Deployment

### Environment Setup

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Checklist

- [ ] Set NODE_ENV to production
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Enable database backups
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Set up CDN (optional)
- [ ] Enable gzip compression
- [ ] Configure firewall rules

### Heroku Deployment

```bash
# Install Heroku CLI
# Create app
heroku create uploadit-app

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Troubleshooting Configuration Issues

### Port Already in Use

```bash
# Windows: Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID [PID] /F

# Linux/Mac
lsof -i :5000
kill -9 [PID]
```

### Module Not Found

```bash
# Reinstall dependencies
rm -r node_modules
npm install
```

### CORS Errors

Check that backend CORS allows frontend origin:
- Frontend: `http://localhost:3000` (development)
- Backend should have this in CORS config

---

## Resources

- **Node.js:** https://nodejs.org
- **Express:** https://expressjs.com
- **Multer:** https://github.com/expressjs/multer
- **PM2:** https://pm2.keymetrics.io
- **Docker:** https://www.docker.com

---

Last Updated: 2026
Version: 1.0.0
