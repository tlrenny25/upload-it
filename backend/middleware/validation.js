const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.vbs', '.js'];
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1 GB

// Simple NSFW detection - in production, use a proper AI service
const containsPotentialNSFW = (buffer) => {
  const nsfwKeywords = [
    'adult', 'nude', 'xxx', 'porn', 'sexual', 'explicit',
    'mature', 'nsfw', 'sex', 'naked', 'erotic'
  ];
  
  // This is a basic check - in production use proper image detection
  // For now, we'll just check file metadata and user should report
  return false;
};

const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 1 GB limit' };
  }

  // Get file extension
  const ext = require('path').extname(file.originalname).toLowerCase();

  // Check if extension is blocked
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return { 
      valid: false, 
      error: `File type ${ext} is not allowed. Executable files are blocked for security.` 
    };
  }

  return { valid: true };
};

module.exports = {
  validateFile,
  containsPotentialNSFW,
  BLOCKED_EXTENSIONS,
  MAX_FILE_SIZE
};
