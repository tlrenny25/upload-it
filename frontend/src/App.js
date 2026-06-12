import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UploadPage from './pages/UploadPage';
import FileListPage from './pages/FileListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <div className="navbar-container">
            <h1 className="logo">Upload.IT</h1>
            <p className="tagline">Secure File Sharing Made Simple</p>
            <nav className="nav-buttons">
              <Link 
                to="/"
                className="nav-btn"
              >
                Upload Files
              </Link>
              <Link 
                to="/files"
                className="nav-btn"
              >
                My Files
              </Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/files" element={<FileListPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 Upload.IT - All rights reserved</p>
          <p className="warning"> NSFW files are strictly not allowed</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
