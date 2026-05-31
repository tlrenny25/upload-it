# Upload.IT - Quick Render Deployment Commands

## 🚀 One-Command Deployment Summary

```bash
# 1. SETUP GIT REPOSITORY
cd d:\uploadit
git init
git add .
git commit -m "Initial Upload.IT commit"

# 2. CREATE GITHUB REPO AND PUSH
git remote add origin https://github.com/YOUR-USERNAME/uploadit.git
git branch -M main
git push -u origin main

# 3. DEPLOY ON RENDER
# Go to https://dashboard.render.com
# Click "New +" → "Web Service"
# Select your uploadit repository
# Follow the Render dashboard setup
```

---

## 📋 Complete Step-by-Step Commands

### **Step 1: Prepare Local Repository**

```bash
# Navigate to project
cd d:\uploadit

# Initialize Git (if not already done)
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Initial Upload.IT commit - file sharing platform"

# Verify status
git status
```

### **Step 2: Create GitHub Repository**

```bash
# Visit https://github.com/new and create a repository named "uploadit"
# Do NOT initialize with README, .gitignore, or license

# After creating, use these commands:

# Add GitHub as remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/uploadit.git

# Rename main branch (if on master)
git branch -M main

# Push to GitHub
git push -u origin main

# Verify remote
git remote -v
```

### **Step 3: Deploy Backend on Render**

```bash
# Visit: https://dashboard.render.com
# 1. Click "New +" → "Web Service"
# 2. Connect GitHub (authorize)
# 3. Select "uploadit" repository
# 4. Fill in settings:
#    - Name: uploadit-backend
#    - Root Directory: backend
#    - Environment: Node
#    - Build Command: npm install
#    - Start Command: npm start
# 5. Add Environment Variables:
#    - NODE_ENV = production
#    - PORT = 10000
# 6. Click "Create Web Service"
```

### **Step 4: Deploy Frontend on Render**

```bash
# Visit: https://dashboard.render.com
# 1. Click "New +" → "Web Service"
# 2. Select "uploadit" repository again
# 3. Fill in settings:
#    - Name: uploadit-frontend
#    - Root Directory: frontend
#    - Environment: Node
#    - Build Command: npm install && npm run build
#    - Start Command: npm start
# 4. Add Environment Variables:
#    - REACT_APP_API_URL = https://uploadit-backend.onrender.com
# 5. Click "Create Web Service"
```

### **Step 5: Configure CORS**

```bash
# After both services are deployed:
# 1. Go to backend service on Render
# 2. Settings → Environment Variables
# 3. Add:
#    CORS_ORIGIN = https://uploadit-frontend.onrender.com
# 4. Save (automatic redeploy)
```

### **Step 6: Update Environment Files**

```bash
# Update backend .env (if using .env)
cd backend
# Edit .env:
#   PORT=10000
#   NODE_ENV=production
#   CORS_ORIGIN=https://uploadit-frontend.onrender.com

# Update frontend .env (create if not exists)
cd ../frontend
# Create .env.production:
#   REACT_APP_API_URL=https://uploadit-backend.onrender.com
```

### **Step 7: Push Updates to GitHub**

```bash
cd d:\uploadit

# After making changes
git add .
git commit -m "Update environment config for Render deployment"
git push origin main

# Render automatically redeploys!
```

---

## 🔄 Deploy Updates (After Initial Deployment)

```bash
# Make code changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Your changes description"

# Push to GitHub
git push origin main

# Render automatically redeploys both services!
```

---

## 📊 Monitor Deployment

```bash
# View service logs (via Render Dashboard)
# 1. Go to https://dashboard.render.com
# 2. Click on service (backend or frontend)
# 3. Scroll to "Logs" section
# 4. Look for errors or status messages

# Check service status
# Services should show green "Live" badge

# Test your app
# Frontend: https://uploadit-frontend.onrender.com
# Backend API: https://uploadit-backend.onrender.com/api/health
```

---

## 🔗 Important URLs After Deployment

```
Frontend:   https://uploadit-frontend.onrender.com
Backend:    https://uploadit-backend.onrender.com
API Health: https://uploadit-backend.onrender.com/api/health
```

---

## 🐛 Troubleshooting

### Build Failed

```bash
# 1. Check logs in Render dashboard
# 2. Verify package.json exists in backend/ and frontend/
# 3. Try manual rebuild in Render dashboard
# 4. Check for Node version compatibility
```

### Files Not Uploading

```bash
# 1. Check backend logs
# 2. Verify CORS_ORIGIN is set correctly
# 3. Check REACT_APP_API_URL in frontend
# 4. Test with: curl https://uploadit-backend.onrender.com/api/health
```

### 502 Bad Gateway Error

```bash
# 1. Backend crashed - check logs
# 2. Verify start command is correct
# 3. Check PORT environment variable
# 4. Wait 2-3 minutes for startup
```

### Service Keeps Spinning Down

```bash
# Normal for free tier - services restart if idle 15+ minutes
# Upgrade to Standard plan for persistent service
# Or use keep-alive service to prevent spin-down
```

---

## 💾 File Storage Options

### Option 1: Keep Current (Ephemeral - Will Reset)

```bash
# Files are deleted when service restarts
# Fine for testing/demo
# Data persists between deployments, not restarts
```

### Option 2: Add Render Disk (Recommended)

```bash
# 1. Go to backend service
# 2. Disks → Create Disk
# 3. Name: uploads-disk
# 4. Mount Path: /app/backend/uploads
# 5. Size: 5GB (or more)
```

### Option 3: Use AWS S3 (Production)

```bash
# Install S3 SDK
npm install aws-sdk

# Set environment variables in Render:
# AWS_ACCESS_KEY_ID = your-key
# AWS_SECRET_ACCESS_KEY = your-secret
# AWS_REGION = us-east-1
# S3_BUCKET = your-bucket-name

# Update upload routes to use S3
```

---

## 🔐 Security Checklist

- [ ] Environment variables set on Render (not in code)
- [ ] CORS_ORIGIN configured to your frontend domain
- [ ] REACT_APP_API_URL configured to your backend domain
- [ ] Sensitive data not committed to GitHub
- [ ] .gitignore configured properly
- [ ] HTTPS enabled (automatic on Render)

---

## 📈 Performance Tips

1. **Use Render Disk** for file persistence
2. **Upgrade to Standard plan** for better performance
3. **Add caching** for frequently accessed files
4. **Monitor logs** for errors and performance issues
5. **Keep dependencies updated** for security

---

## 🎯 Final Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend service deployed on Render
- [ ] Frontend service deployed on Render
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] File upload tested
- [ ] File download tested
- [ ] Temporary files tested
- [ ] Preview links working

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **GitHub Help**: https://github.com/support
- **Node.js Docs**: https://nodejs.org/docs

---

**Version**: 1.0.0  
**Last Updated**: 2026
