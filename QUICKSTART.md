# Upload.IT - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org)
- **npm** (comes with Node.js)

### Installation (One-time setup)

#### Option 1: Using Setup Batch Script (Recommended for Windows)
1. Double-click `setup.bat` in the project root
2. Wait for npm to install dependencies for both backend and frontend
3. The script will tell you the next steps

#### Option 2: Manual Installation

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

### Option 1: Using Start Batch Script (Recommended)
1. Double-click `start.bat` in the project root
2. Two terminal windows will open automatically
3. Backend will start on `http://localhost:5000`
4. Frontend will start on `http://localhost:3000`
5. Open your browser to `http://localhost:3000`

### Option 2: Manual Start

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`
(Browser will automatically open)

---

## 📋 Features Overview

### ✅ Permanent Files
- Upload files to permanent storage
- Access files anytime
- Download or delete anytime
- No automatic expiration

### ⏱️ Temporary Files
- Set custom expiration time (1 minute to 1 year)
- Files automatically deleted after expiration
- Quick presets: 1h, 1d, 1w, 1mo, 1yr
- Download before expiration

### 🔒 Security Features
- **Blocked file types:** .exe, .bat, .cmd, .com, .msi, .scr, .vbs, .js
- **File size limit:** 1 GB maximum
- **NSFW content:** Server-side warnings and enforcement
- **Unique file IDs:** UUID-based naming
- **Automatic cleanup:** Expired files removed every 5 minutes

---

## 📖 Usage Instructions

### Upload Files
1. Click **"Upload Files"** in the navigation
2. Select a file (or drag & drop)
3. **Optional:** Enable "Temporary Storage" and set expiration
4. Click **"Upload File"** button
5. Get download link on success

### Manage Files
1. Click **"My Files"** in the navigation
2. Switch between **"Permanent Files"** and **"Temporary Files"** tabs
3. **Download:** Click the download button
4. **Delete:** Click the delete button
5. See expiration countdown for temporary files

### File Rules
- ❌ **Blocked:** .exe, .bat, .cmd, .com, .msi, .scr, .vbs, .js
- 📦 **Max size:** 1 GB per file
- ⏱️ **Min expiration:** 1 minute
- ⏱️ **Max expiration:** 1 year (525,600 minutes)
- 🚫 **No NSFW content allowed**

---

## 🛠️ Development

### Project Structure
```
uploadit/
├── backend/
│   ├── server.js          # Express server
│   ├── routes/upload.js   # API endpoints
│   ├── middleware/        # Validation logic
│   ├── uploads/           # Permanent storage
│   ├── temp/              # Temporary storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/         # Upload & Files pages
│   │   └── styles/        # CSS files
│   ├── public/
│   └── package.json
└── README.md
```

### API Endpoints (Backend)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload/file` | Upload a file |
| GET | `/api/upload/list/:type` | List files (permanent/temp) |
| GET | `/api/upload/download/:filename` | Download file |
| DELETE | `/api/upload/delete/:filename` | Delete file |
| GET | `/api/health` | Health check |

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if Node.js is installed
node --version

# Check if port 5000 is available (may be in use)
netstat -ano | findstr :5000

# Reinstall dependencies
cd backend
rm -r node_modules
npm install
npm start
```

### Frontend won't connect to backend
- Verify backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Clear browser cache (Ctrl+Shift+Delete)
- Try restarting both servers

### Files not uploading
- ✓ File is smaller than 1 GB
- ✓ File extension is not in blocked list
- ✓ Check browser console for detailed errors
- ✓ Ensure backend server is running

### npm command not found
- Install Node.js from https://nodejs.org
- Restart terminal after installation

---

## 📚 For Development

### Install Additional Packages (if needed)

**Backend:**
```bash
cd backend
npm install package-name
```

**Frontend:**
```bash
cd frontend
npm install package-name
```

### Development Mode with Auto-reload

**Backend (with nodemon):**
```bash
cd backend
npm run dev
```

---

## 🌐 Ports & URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:5000 | 5000 |

---

## 📝 File Naming Convention

Files are stored with a unique naming pattern:
```
[timestamp]_[uuid]_[originalname]
```

For temporary files, expiration time is also included:
```
[expirationMs]_[timestamp]_[uuid]_[originalname]
```

---

## 🎯 Common Tasks

### Delete all uploaded files
```bash
# Backend uploaded files
rm -r backend/uploads/*
rm -r backend/temp/*
```

### View backend logs
```bash
cd backend
npm start
# Look for messages in console
```

### Check what's in uploads
```bash
# List permanent files
dir backend\uploads

# List temporary files
dir backend\temp
```

---

## 🔗 Resources

- **Node.js Docs:** https://nodejs.org/docs
- **Express.js:** https://expressjs.com
- **React:** https://react.dev
- **Multer (File Upload):** https://github.com/expressjs/multer

---

## 💡 Tips

1. **Use the batch scripts** for easier startup
2. **Enable temporary storage** for sensitive files
3. **Share download links** with temporary storage for time-limited access
4. **Check file list** before uploading duplicates
5. **Monitor expiration times** to prevent losing files

---

## 🎉 You're all set!

Upload.IT is now ready to use. Start uploading files securely!

**Questions?** Check the main README.md for more details.

---

Version: 1.0.0
Last Updated: 2026
