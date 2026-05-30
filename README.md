# Upload.IT - Secure File Sharing Platform

A modern web application for securely uploading and sharing files with advanced features like temporary file storage and automatic expiration.

## Features

✨ **Core Features:**
- 📤 Secure file upload with size limit (max 1 GB)
- 🔒 Block dangerous executable files (.exe, .bat, .cmd, .com, .msi, .scr, .vbs, .js)
- ⏱️ Temporary file storage with customizable expiration (1 minute to 1 year)
- 📁 Permanent file storage
- 🗑️ Delete your own files anytime
- 🚫 NSFW content warning and server-side enforcement
- 📊 File management dashboard
- 📥 Download uploaded files

## Project Structure

```
uploadit/
├── backend/                 # Node.js/Express server
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Permanent file storage
│   ├── temp/               # Temporary file storage
│   ├── package.json
│   ├── server.js
│   └── .env
└── frontend/               # React application
    ├── src/
    │   ├── components/
    │   ├── pages/          # Main pages
    │   ├── styles/         # CSS modules
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    └── .env
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env` already created with defaults):
```
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Upload File
- **POST** `/api/upload/file`
- **Body:** FormData with file, temporary, expirationMinutes
- **Returns:** File metadata and download URL

### List Files
- **GET** `/api/upload/list/:type` (type: 'permanent' or 'temp')
- **Returns:** Array of files with metadata

### Download File
- **GET** `/api/upload/download/:filename`
- **Returns:** File download

### Delete File
- **DELETE** `/api/upload/delete/:filename`
- **Returns:** Success message

## File Validation

**Blocked Extensions:**
- `.exe` - Executable
- `.bat` - Batch file
- `.cmd` - Command file
- `.com` - DOS executable
- `.msi` - Windows installer
- `.scr` - Screen saver
- `.vbs` - VBScript
- `.js` - JavaScript file (blocked for security)

**Size Limit:** 1 GB

**NSFW Content:** Server-side enforcement with user warnings

## Temporary File Expiration

Files can be set to expire from:
- 1 minute (minimum)
- Up to 525,600 minutes (1 year, maximum)

The server automatically cleans up expired files every 5 minutes.

## Usage

1. **Upload Files:**
   - Click "Upload Files" tab
   - Select a file or drag & drop
   - Optionally enable temporary storage
   - Set expiration time (if temporary)
   - Click "Upload File"

2. **Manage Files:**
   - Click "My Files" tab
   - View permanent and temporary files
   - Download files at any time
   - Delete files you own

3. **Temporary Storage:**
   - Enable on the main page
   - Set custom expiration from 1 minute to 1 year
   - Use preset buttons for quick selection
   - Files automatically deleted after expiration

## Security Features

✅ **File Type Validation:** Server-side extension checking
✅ **File Size Enforcement:** 1 GB maximum limit
✅ **NSFW Content Warnings:** Prominent warnings displayed
✅ **Automatic Cleanup:** Expired files removed by scheduler
✅ **Unique File IDs:** UUID generation for file tracking
✅ **Error Handling:** Comprehensive error messages

## Development

### Project Structure Details

**Backend:**
- `server.js` - Main Express app with cleanup scheduler
- `routes/upload.js` - File upload, download, list, delete endpoints
- `middleware/validation.js` - File validation logic

**Frontend:**
- `App.js` - Main app with navigation
- `pages/UploadPage.js` - File upload interface
- `pages/FileListPage.js` - File management interface
- `styles/` - Component styling

### Future Enhancements

- 🔐 User authentication and accounts
- 🔍 NSFW image detection using AI
- 📊 Usage analytics and statistics
- 🎨 Dark mode
- 📱 Mobile app
- 🔗 File sharing links
- 👥 Collaboration features
- 🔐 End-to-end encryption

## Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Ensure Node.js is installed: `node --version`
- Run `npm install` again

**Frontend won't connect to backend:**
- Verify backend is running on port 5000
- Check CORS settings in `server.js`
- Clear browser cache

**Files not uploading:**
- Check file size (must be < 1 GB)
- Verify file extension is not in blocked list
- Check browser console for errors

## License

MIT License - Feel free to use this project

## Support

For issues or questions, please check the error messages or contact support.

---

**Upload.IT** - Making file sharing secure and simple! 🚀
