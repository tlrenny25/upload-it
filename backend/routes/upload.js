const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { validateFile } = require('../middleware/validation');
const { generateShareCode, addMapping, getMapping, deleteMapping } = require('../middleware/fileMapping');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.body.temporary === 'true' 
      ? path.join(__dirname, '../temp')
      : path.join(__dirname, '../uploads');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 } });

// Upload file
router.post('/file', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file
    const validation = validateFile(req.file);
    if (!validation.valid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: validation.error });
    }

    const isTemporary = req.body.temporary === 'true';
    const expirationMinutes = parseInt(req.body.expirationMinutes) || 60;

    if (isTemporary && (expirationMinutes < 1 || expirationMinutes > 525600)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'Expiration time must be between 1 minute and 1 year (525600 minutes)' 
      });
    }

    // Generate unique share code
    const shareCode = generateShareCode();

    // Determine file type for preview
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'unknown';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext)) fileType = 'image';
    else if (['.pdf'].includes(ext)) fileType = 'pdf';
    else if (['.txt', '.md', '.json', '.xml', '.html', '.css', '.js'].includes(ext)) fileType = 'text';
    else if (['.mp4', '.avi', '.mov', '.mkv', '.webm'].includes(ext)) fileType = 'video';
    else if (['.mp3', '.wav', '.flac', '.aac', '.ogg'].includes(ext)) fileType = 'audio';
    else if (['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(ext)) fileType = 'document';
    else fileType = 'file';

    // Store mapping
    addMapping(shareCode, req.file.filename, req.file.originalname, fileType, isTemporary);

    // Rename file if temporary to include expiration
    if (isTemporary) {
      const expirationMs = expirationMinutes * 60 * 1000;
      const newFilename = `${expirationMs}_${req.file.filename}`;
      const newPath = path.join(path.dirname(req.file.path), newFilename);
      fs.renameSync(req.file.path, newPath);
      req.file.filename = newFilename;
      req.file.path = newPath;
    }

    // NSFW warning message (server-side enforcement)
    const nsfw_warning = `⚠️ WARNING: NSFW (Not Safe For Work) files are STRICTLY NOT ALLOWED on Upload.IT. 
    Uploading such content may result in account suspension.`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: req.file.filename,
        name: req.file.originalname,
        size: req.file.size,
        uploadTime: new Date(),
        temporary: isTemporary,
        expirationMinutes: isTemporary ? expirationMinutes : null,
        url: `/api/upload/download/${req.file.filename}`,
        shareCode: shareCode,
        previewUrl: `/api/upload/preview/${shareCode}`,
        fileType: fileType
      },
      nsfw_warning
    });

  } catch (err) {
    console.error('Upload error:', err);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ error: 'File upload failed', details: err.message });
  }
});

// Preview file
router.get('/preview/:shareCode', (req, res) => {
  try {
    const shareCode = req.params.shareCode;
    const mapping = getMapping(shareCode);

    if (!mapping) {
      return res.status(404).json({ error: 'Preview not found' });
    }

    let filePath = path.join(__dirname, '../uploads', mapping.filename);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../temp', mapping.filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Send preview response based on file type
    res.json({
      success: true,
      filename: mapping.originalName,
      fileType: mapping.fileType,
      shareCode: shareCode,
      uploadTime: mapping.createdAt,
      downloadUrl: `/api/upload/download/${mapping.filename}`
    });

  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Preview failed', details: err.message });
  }
});

// List files
router.get('/list/:type', (req, res) => {
  try {
    const type = req.params.type;
    const dir = type === 'temp' 
      ? path.join(__dirname, '../temp')
      : path.join(__dirname, '../uploads');

    if (!fs.existsSync(dir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(dir).map(filename => {
      const filePath = path.join(dir, filename);
      const stat = fs.statSync(filePath);
      const originalName = filename.split('_').slice(2).join('_');
      
      let expirationMinutes = null;
      let expiresAt = null;

      if (type === 'temp') {
        const expirationMs = parseInt(filename.split('_')[0]);
        expirationMinutes = Math.round(expirationMs / (60 * 1000));
        expiresAt = new Date(stat.birthtime.getTime() + expirationMs);
      }

      return {
        id: filename,
        name: originalName,
        size: stat.size,
        uploadTime: stat.birthtime,
        expirationMinutes,
        expiresAt,
        url: `/api/upload/download/${filename}`
      };
    });

    res.json({ files });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: 'Failed to list files', details: err.message });
  }
});

// Download file
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    let filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../temp', filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const originalName = filename.split('_').slice(2).join('_');
    res.download(filePath, originalName);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Download failed', details: err.message });
  }
});

// Delete file
router.delete('/delete/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    let filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../temp', filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

module.exports = router;
