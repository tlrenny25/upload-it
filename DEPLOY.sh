#!/bin/bash
# Upload.IT - Render Deployment Commands (Shell Script)
# Copy and run these commands one by one

# =============================================================
# STEP 1: SETUP LOCAL GIT REPOSITORY
# =============================================================

cd d:\\uploadit

git init

git add .

git commit -m "Initial Upload.IT commit with preview links and Render config"

git status


# =============================================================
# STEP 2: PUSH TO GITHUB
# =============================================================

# First create a repo at https://github.com/new (name it "uploadit")
# Then run these commands (replace YOUR-USERNAME):

git remote add origin https://github.com/YOUR-USERNAME/uploadit.git

git branch -M main

git push -u origin main

# Verify:
git remote -v


# =============================================================
# STEP 3: DEPLOY ON RENDER (via Dashboard)
# =============================================================

# Go to: https://dashboard.render.com
# Click: New + → Web Service
# Connect GitHub
# Select: uploadit repository

# BACKEND SERVICE:
# - Name: uploadit-backend
# - Root Directory: backend
# - Build Command: npm install
# - Start Command: npm start
# - Environment Variables:
#   NODE_ENV = production
#   PORT = 10000

# FRONTEND SERVICE:
# - Name: uploadit-frontend
# - Root Directory: frontend
# - Build Command: npm install && npm run build
# - Start Command: npm start
# - Environment Variables:
#   REACT_APP_API_URL = https://uploadit-backend.onrender.com


# =============================================================
# STEP 4: CONFIGURE CORS
# =============================================================

# After services are deployed:
# Backend Service → Settings → Environment
# Add: CORS_ORIGIN = https://uploadit-frontend.onrender.com
# Click Save (auto-redeploy)


# =============================================================
# STEP 5: DEPLOY UPDATES (After making changes)
# =============================================================

cd d:\\uploadit

git add .

git commit -m "Your changes description"

git push origin main

# Render automatically redeploys!


# =============================================================
# VERIFY DEPLOYMENT
# =============================================================

# Test health endpoint:
curl https://uploadit-backend.onrender.com/api/health

# Visit in browser:
# Frontend: https://uploadit-frontend.onrender.com
# Test uploading and preview links


# =============================================================
# ENVIRONMENT FILE EXAMPLES
# =============================================================

# backend/.env (for local development)
# PORT=5000
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:3000

# frontend/.env (for local development)
# REACT_APP_API_URL=http://localhost:5000

# On Render, set these in Dashboard Environment Variables


# =============================================================
# TROUBLESHOOTING COMMANDS
# =============================================================

# View backend logs (via Render Dashboard)
# Services → uploadit-backend → Logs

# View frontend logs (via Render Dashboard)
# Services → uploadit-frontend → Logs

# Test file upload:
# curl -X POST -F "file=@test.txt" http://localhost:5000/api/upload/file

# Test preview endpoint:
# curl http://localhost:5000/api/upload/preview/aBc1Xy

# Test list files:
# curl http://localhost:5000/api/upload/list/permanent


# =============================================================
# OPTIONAL: ADD PERSISTENT STORAGE
# =============================================================

# Backend Service → Disks → Create Disk
# Name: uploads-disk
# Mount Path: /app/backend/uploads
# Size: 5 GB (or larger)
# Click Create


# =============================================================
# OPTIONAL: UPGRADE PLAN
# =============================================================

# For production use, upgrade from Free to Standard:
# Service → Settings → Plan → Choose Standard
# Cost: ~$7-10 per service per month


# =============================================================
# USEFUL LINKS
# =============================================================

# Render Dashboard: https://dashboard.render.com
# Render Docs: https://render.com/docs
# GitHub: https://github.com
# Upload.IT Frontend: https://uploadit-frontend.onrender.com
# Upload.IT Backend: https://uploadit-backend.onrender.com
