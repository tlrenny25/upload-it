import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FileListPage.css';

function FileListPage() {
  const [permanentFiles, setPermanentFiles] = useState([]);
  const [temporaryFiles, setTemporaryFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('permanent');

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    try {
      const [permRes, tempRes] = await Promise.all([
        axios.get('/api/upload/list/permanent'),
        axios.get('/api/upload/list/temp')
      ]);

      setPermanentFiles(permRes.data.files || []);
      setTemporaryFiles(tempRes.data.files || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching files:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (filename, isTemporary) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete(`/api/upload/delete/${filename}`);
      setMessageType('success');
      setMessage('✅ File deleted successfully');
      
      if (isTemporary) {
        setTemporaryFiles(temporaryFiles.filter(f => f.id !== filename));
      } else {
        setPermanentFiles(permanentFiles.filter(f => f.id !== filename));
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessageType('error');
      setMessage(`❌ ${err.response?.data?.error || 'Delete failed'}`);
    }
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

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return <div className="file-list-page"><p>Loading files...</p></div>;
  }

  return (
    <div className="file-list-page">
      <div className="file-list-container">
        <h2>My Files</h2>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'permanent' ? 'active' : ''}`}
            onClick={() => setActiveTab('permanent')}
          >
            📁 Permanent Files ({permanentFiles.length})
          </button>
          <button
            className={`tab ${activeTab === 'temporary' ? 'active' : ''}`}
            onClick={() => setActiveTab('temporary')}
          >
            ⏱️ Temporary Files ({temporaryFiles.length})
          </button>
        </div>

        <div className="file-section">
          {activeTab === 'permanent' && (
            <>
              {permanentFiles.length === 0 ? (
                <p className="empty-message">No permanent files uploaded yet</p>
              ) : (
                <div className="files-grid">
                  {permanentFiles.map(file => (
                    <div key={file.id} className="file-card">
                      <div className="file-icon">📄</div>
                      <div className="file-content">
                        <h3 className="file-name">{file.name}</h3>
                        <p className="file-size">{formatFileSize(file.size)}</p>
                        <p className="file-time">📅 {formatDate(file.uploadTime)}</p>
                      </div>
                      <div className="file-actions">
                        <a 
                          href={file.url}
                          className="btn download-btn"
                          download
                        >
                          ⬇️ Download
                        </a>
                        <button 
                          className="btn delete-btn"
                          onClick={() => handleDelete(file.id, false)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'temporary' && (
            <>
              {temporaryFiles.length === 0 ? (
                <p className="empty-message">No temporary files uploaded yet</p>
              ) : (
                <div className="files-grid">
                  {temporaryFiles.map(file => (
                    <div key={file.id} className="file-card temporary">
                      <div className="file-icon">📄</div>
                      <div className="expiration-badge">
                        ⏳ {getTimeRemaining(file.expiresAt)}
                      </div>
                      <div className="file-content">
                        <h3 className="file-name">{file.name}</h3>
                        <p className="file-size">{formatFileSize(file.size)}</p>
                        <p className="file-time">📅 {formatDate(file.uploadTime)}</p>
                        <p className="expiration-time">
                          🕐 Expires: {formatDate(file.expiresAt)}
                        </p>
                      </div>
                      <div className="file-actions">
                        <a 
                          href={file.url}
                          className="btn download-btn"
                          download
                        >
                          ⬇️ Download
                        </a>
                        <button 
                          className="btn delete-btn"
                          onClick={() => handleDelete(file.id, true)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileListPage;
