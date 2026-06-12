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
      ? req.tempDir
      : req.uploadsDir;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 } });

// MIME types for preview
const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.md': 'text/plain',
  '.json': 'application/json',
  '.xml': 'text/xml',
  '.html': 'text/html',
  '.css': 'text/css',
  '.mp4': 'video/mp4',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg'
};

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

    let actualFilename = req.file.filename;

    // Rename file if temporary to include expiration
    if (isTemporary) {
      const expirationMs = expirationMinutes * 60 * 1000;
      const newFilename = `${expirationMs}_${req.file.filename}`;
      const newPath = path.join(path.dirname(req.file.path), newFilename);
      fs.renameSync(req.file.path, newPath);
      actualFilename = newFilename;
    }

    // Store mapping
    addMapping(shareCode, actualFilename, req.file.originalname, 'file', isTemporary);

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
        downloadUrl: `/api/upload/download/${actualFilename}`,
        previewUrl: `/api/upload/preview/${shareCode}`
      }
    });

  } catch (err) {
    console.error('Upload error:', err);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ error: 'File upload failed' });
  }
});

// PREVIEW - Serve actual file (NO JSON, just the file)
router.get('/preview/:shareCode', (req, res) => {
  try {
    const shareCode = req.params.shareCode;
    const mapping = getMapping(shareCode);

    if (!mapping) {
      return res.status(404).send('File not found');
    }

    let filePath = path.join(req.uploadsDir, mapping.filename);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(req.tempDir, mapping.filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    const ext = path.extname(mapping.filename).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${mapping.originalName}"`);
    res.sendFile(filePath);

  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).send('Error');
  }
});

// List files
router.get('/list/:type', (req, res) => {
  try {
    const type = req.params.type;
    const dir = type === 'temp' ? req.tempDir : req.uploadsDir;

    if (!fs.existsSync(dir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(dir).map(filename => {
      const filePath = path.join(dir, filename);
      const stat = fs.statSync(filePath);
      
      let originalName = filename;
      const parts = filename.split('_');
      
      if (type === 'temp' && parts.length >= 3) {
        originalName = parts.slice(2).join('_');
      } else if (parts.length >= 2) {
        originalName = parts.slice(1).join('_');
      }
      
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
        downloadUrl: `/api/upload/download/${filename}`
      };
    });

    res.json({ files });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Download file
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    let filePath = path.join(req.uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(req.tempDir, filename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const parts = filename.split('_');
    let originalName = filename;
    
    if (parts.length >= 3) {
      originalName = parts.slice(2).join('_');
    } else if (parts.length >= 2) {
      originalName = parts.slice(1).join('_');
    }
    
    res.download(filePath, originalName);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Delete file
router.delete('/delete/:filename', (req, res) => {
