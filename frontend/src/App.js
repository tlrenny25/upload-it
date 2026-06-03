import React, { useState } from 'react';
import './App.css';
import UploadPage from './pages/UploadPage';
import FileListPage from './pages/FileListPage';

function App() {
  const [currentPage, setCurrentPage] = useState('upload');

  return (
    <div className="App">
      <header className="navbar">
        <div className="navbar-container">
          <h1 className="logo">Upload.IT</h1>
          <p className="tagline">Secure File Sharing Made Simple</p>
          <nav className="nav-buttons">
            <button 
              className={`nav-btn ${currentPage === 'upload' ? 'active' : ''}`}
              onClick={() => setCurrentPage('upload')}
            >
              Upload Files
            </button>
            <button 
              className={`nav-btn ${currentPage === 'files' ? 'active' : ''}`}
              onClick={() => setCurrentPage('files')}
            >
              My Files
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {currentPage === 'upload' && <UploadPage />}
        {currentPage === 'files' && <FileListPage />}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Upload.IT - All rights reserved</p>
        <p className="warning">⚠️ NSFW files are strictly not allowed</p>
      </footer>
    </div>
  );
}

export default App;
