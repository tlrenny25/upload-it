import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UploadPage.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [temporary, setTemporary] = useState(false);
  const [expirationMinutes, setExpirationMinutes] = useState(60);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.vbs', '.js'];
  const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1 GB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setMessageType('error');
      setMessage('❌ File size exceeds 1 GB limit');
      setFile(null);
      return;
    }

    // Check extension
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      setMessageType('error');
      setMessage(`❌ File type ${ext} is not allowed. Executable files are blocked for security.`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessageType('error');
      setMessage('❌ Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('temporary', temporary);
    formData.append('expirationMinutes', expirationMinutes);

    try {
      const response = await axios.post('/api/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessageType('success');
      setMessage(`✅ ${response.data.message}`);
      
      // Add full API URL to share links
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const file = {
        ...response.data.file,
        previewUrl: `${apiUrl}/api/upload/preview/${response.data.file.shareCode}`,
        url: `${apiUrl}/api/upload/download/${response.data.file.id}`
      };
      
      setUploadedFile(file);
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setMessageType('error');
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessageType('info');
    setMessage('✅ Link copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Upload Your Files</h2>
        
        <div className="warnings">
          <div className="warning-box">
            <strong>⚠️ WARNING:</strong> NSFW (Not Safe For Work) files are <strong>STRICTLY NOT ALLOWED</strong>
          </div>
          <div className="blocked-files-box">
            <strong>🔒 Blocked File Types:</strong> .exe, .bat, .cmd, .com, .msi, .scr, .vbs, .js
          </div>
          <div className="size-limit-box">
            <strong>📦 File Size Limit:</strong> Maximum 1 GB per file
          </div>
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          <div className="file-input-wrapper">
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
            <label htmlFor="fileInput" className="file-label">
              {file ? `📄 ${file.name}` : 'Choose File or Drag & Drop'}
            </label>
          </div>

          {file && (
            <div className="file-info">
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
            </div>
          )}

          <div className="options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={temporary}
                onChange={(e) => setTemporary(e.target.checked)}
                disabled={uploading}
              />
              Enable Temporary Storage
            </label>

            {temporary && (
              <div className="expiration-setting">
                <label htmlFor="expiration">
                  Expiration Time:
                  <span className="expiration-value">
                    {expirationMinutes === 525600 
                      ? '1 Year' 
                      : expirationMinutes >= 1440 
                        ? `${Math.round(expirationMinutes / 1440)} Days`
                        : expirationMinutes >= 60
                          ? `${Math.round(expirationMinutes / 60)} Hours`
                          : `${expirationMinutes} Minutes`}
                  </span>
                </label>
                <input
                  id="expiration"
                  type="range"
                  min="1"
                  max="525600"
                  value={expirationMinutes}
                  onChange={(e) => setExpirationMinutes(parseInt(e.target.value))}
                  disabled={uploading}
                  className="expiration-slider"
                />
                <div className="time-presets">
                  <button type="button" onClick={() => setExpirationMinutes(60)} disabled={uploading}>1h</button>
                  <button type="button" onClick={() => setExpirationMinutes(1440)} disabled={uploading}>1d</button>
                  <button type="button" onClick={() => setExpirationMinutes(10080)} disabled={uploading}>1w</button>
                  <button type="button" onClick={() => setExpirationMinutes(43200)} disabled={uploading}>1mo</button>
                  <button type="button" onClick={() => setExpirationMinutes(525600)} disabled={uploading}>1yr</button>
                </div>
              </div>
            )}
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="upload-btn"
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {uploadedFile && (
          <div className="success-info">
            <h3>✅ Upload Successful!</h3>
            <div className="file-details">
              <p><strong>Filename:</strong> {uploadedFile.name}</p>
              <p><strong>Size:</strong> {formatFileSize(uploadedFile.size)}</p>
              <p><strong>Upload Time:</strong> {formatDate(uploadedFile.uploadTime)}</p>
              {uploadedFile.temporary && (
                <p><strong>Expires In:</strong> {uploadedFile.expirationMinutes} minutes</p>
              )}
              
              <hr className="divider" />
              
              <div className="share-section">
                <h4>📤 Share Your File</h4>
                
                <div className="share-link-box">
                  <p><strong>Preview Link (6-Char Code):</strong></p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      value={uploadedFile.previewUrl} 
                      readOnly 
                      className="link-input"
                    />
                    <button 
                      onClick={() => copyToClipboard(uploadedFile.previewUrl)}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="link-hint">Share this link to let others preview your file</p>
                </div>

                <div className="share-link-box">
                  <p><strong>Download Link:</strong></p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      value={uploadedFile.url} 
                      readOnly 
                      className="link-input"
                    />
                    <button 
                      onClick={() => copyToClipboard(uploadedFile.url)}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                  <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="direct-link">
                    Direct Download
                  </a>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setUploadedFile(null)}
              className="close-btn"
            >
              Upload Another File
