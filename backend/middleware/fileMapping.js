const fs = require('fs');
const path = require('path');

const MAPPINGS_FILE = path.join(__dirname, '../.file-mappings.json');

// Load existing mappings
let fileMappings = {};
if (fs.existsSync(MAPPINGS_FILE)) {
  try {
    fileMappings = JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error loading mappings:', err);
    fileMappings = {};
  }
}

// Save mappings to file
const saveMappings = () => {
  try {
    fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(fileMappings, null, 2));
  } catch (err) {
    console.error('Error saving mappings:', err);
  }
};

// Generate random 6-character code
const generateShareCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Ensure code is unique
  if (fileMappings[code]) {
    return generateShareCode();
  }
  
  return code;
};

// Add file mapping
const addMapping = (shareCode, filename, originalName, fileType, isTemporary = false) => {
  fileMappings[shareCode] = {
    filename,
    originalName,
    fileType,
    isTemporary,
    createdAt: new Date().toISOString()
  };
  saveMappings();
};

// Get file mapping
const getMapping = (shareCode) => {
  return fileMappings[shareCode] || null;
};

// Delete mapping
const deleteMapping = (shareCode) => {
  delete fileMappings[shareCode];
  saveMappings();
};

// Get all mappings
const getAllMappings = () => {
  return fileMappings;
};

// Clean up expired mappings
const cleanupExpiredMappings = (tempDir) => {
  const now = Date.now();
  let cleaned = false;

  for (const [code, mapping] of Object.entries(fileMappings)) {
    if (mapping.isTemporary) {
      const filePath = path.join(tempDir, mapping.filename);
      
      // If file doesn't exist, remove mapping
      if (!fs.existsSync(filePath)) {
        delete fileMappings[code];
        cleaned = true;
      }
    }
  }

  if (cleaned) {
    saveMappings();
  }
};

module.exports = {
  generateShareCode,
  addMapping,
  getMapping,
  deleteMapping,
  getAllMappings,
  cleanupExpiredMappings
};
