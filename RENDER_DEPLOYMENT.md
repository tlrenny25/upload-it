# Upload.IT - Render Deployment Guide

## 🚀 Complete Guide to Deploy on Render.com

Render is a modern platform for deploying web applications. This guide will walk you through deploying Upload.IT on Render.

---

## 📋 Prerequisites

Before starting, you'll need:

1. **GitHub Account** - Create one at https://github.com
2. **Render Account** - Create one at https://render.com
3. **Git installed** - Download from https://git-scm.com

---

## 🔧 Step 1: Prepare Your Repository for Deployment

### 1.1 Initialize Git Repository (if not already done)

```bash
cd d:\uploadit
git init
git add .
git commit -m "Initial Upload.IT commit"
```

### 1.2 Update Backend for Production

Edit `backend/.env`:

```env
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.onrender.com
```

### 1.3 Update Frontend API URL

Create/Edit `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-api-domain.onrender.com
```

### 1.4 Create render.yaml Configuration

Create `render.yaml` in your project root:

```bash
# Create the file (Windows)
type nul > render.yaml
```

Then add the content below.

---

## 📄 Step 2: Create render.yaml (Deployment Configuration)

Create this file in the root of your project (d:\uploadit\render.yaml):

```yaml
services:
  - type: web
    name: uploadit-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CORS_ORIGIN
        fromService:
          name: uploadit-frontend
          property: url

  - type: web
    name: uploadit-frontend
    env: node
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm start
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_API_URL
        fromService:
          name: uploadit-backend
          property: url
```

---

## 🔗 Step 3: Push to GitHub

### 3.1 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `uploadit`
3. **Do NOT** initialize with README (we already have one)

### 3.2 Push Your Code to GitHub

```bash
cd d:\uploadit

# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/uploadit.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## 🌐 Step 4: Deploy on Render

### 4.1 Connect Render to GitHub

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"**
4. Click **"Connect account"** to authorize GitHub
5. Select your `uploadit` repository
6. Click **"Connect"**

### 4.2 Configure Backend Service

**Create Backend Service:**

1. **Name**: `uploadit-backend`
2. **Environment**: Node
3. **Build Command**: 
   ```
   cd backend && npm install
   ```
4. **Start Command**:
   ```
   node backend/server.js
   ```
5. **Plan**: Free
6. Click **"Create Web Service"**

**Configure Environment Variables:**

After creating, go to the service's Settings:

1. Scroll to **"Environment"**
2. Add these variables:
   ```
   NODE_ENV = production
   PORT = 10000
   ```
3. Click **"Save"**

### 4.3 Configure Frontend Service

**Create Frontend Service:**

1. Click **"New +"** → **"Web Service"** again
2. Select your `uploadit` repository again
3. **Name**: `uploadit-frontend`
4. **Root Directory**: `frontend`
5. **Build Command**:
   ```
   npm install && npm run build
   ```
6. **Start Command**:
   ```
   npm start
   ```
7. **Plan**: Free
8. Click **"Create Web Service"**

**Configure Environment Variables:**

After creating, go to Settings:

1. Scroll to **"Environment"**
2. Add this variable:
   ```
   REACT_APP_API_URL = https://uploadit-backend.onrender.com
   ```
   (Replace with your actual backend URL from Render)
3. Click **"Save"**

---

## 📝 Step 5: Update CORS Settings

Once your services are deployed and you have their URLs:

1. Go to your backend service on Render
2. Go to **Settings** → **Environment**
3. Update `CORS_ORIGIN` to your frontend URL:
   ```
   CORS_ORIGIN = https://uploadit-frontend.onrender.com
   ```
4. Click **"Save"**
5. Your backend will automatically redeploy

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Service Status

1. Go to https://dashboard.render.com
2. You should see both services running (green status)

### 6.2 Test Your Application

1. Visit your frontend URL: `https://uploadit-frontend.onrender.com`
2. Try uploading a file
3. Check if files are saved correctly

### 6.3 View Logs (If Issues Occur)

1. Click on a service
2. Scroll down to **"Logs"** section
3. Look for errors

---

## 🔄 Step 7: Automatic Deployments

Your services will automatically redeploy whenever you push to GitHub:

```bash
# Make changes
# Commit and push
git add .
git commit -m "Your changes"
git push origin main

# Render automatically redeploys!
```

---

## 📦 File Storage on Render

**Important**: Render uses ephemeral storage. Files are deleted when services restart.

### For Production Use, Add Persistent Storage:

**Option 1: Render Disk (Recommended)**

```yaml
services:
  - type: web
    name: uploadit-backend
    disk:
      name: uploads-disk
      mountPath: /app/backend/uploads
      sizeGB: 5
```

**Option 2: AWS S3 Integration**

```bash
npm install aws-sdk
```

Update `backend/routes/upload.js` to use S3 instead of local storage.

**Option 3: Supabase Storage**

```bash
npm install @supabase/supabase-js
```

---

## 🛠️ Common Issues & Solutions

### Issue: Build Fails

**Solution:**
1. Check **Logs** tab
2. Verify `package.json` has all dependencies
3. Ensure Node version is compatible
4. Try rebuilding manually in Render dashboard

### Issue: Files Not Persisting

**Solution:**
1. Add a Render Disk (see above)
2. Or switch to S3/Supabase storage

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Verify `REACT_APP_API_URL` is correct
2. Check backend `CORS_ORIGIN` is set to frontend URL
3. Wait 2-3 minutes for environment changes to apply

### Issue: 502 Bad Gateway

**Solution:**
1. Check backend logs
2. Verify start command is correct
3. Ensure PORT environment variable is set
4. Check if backend service is running

---

## 🔐 Security Considerations

### 1. Environment Variables

**Never commit sensitive data!** Use Render's environment variables:
- API keys
- Database credentials
- Secret tokens

### 2. CORS Configuration

Keep CORS restricted to your domain:

```javascript
// backend/server.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true
};
app.use(cors(corsOptions));
```

### 3. HTTPS

Render automatically provides HTTPS for all services (security certificate included).

---

## 📈 Scaling & Performance

### For Free Tier:

- Spin down after 15 minutes of inactivity
- Limited memory and CPU
- Good for testing/development

### For Production (Paid Plans):

1. Upgrade to **Standard** or **Pro** plan
2. Enable persistent disks
3. Consider adding a database
4. Enable auto-scaling

---

## 💰 Cost Estimation

**Free Tier:**
- Backend Web Service: Free
- Frontend Web Service: Free
- Monthly bill: **$0**

**Standard Tier (Recommended for Production):**
- Each service: ~$7/month
- Disk storage: ~$0.50/GB/month
- **Total: ~$14-20/month**

---

## 🚀 Command Summary

```bash
# 1. Initialize Git
cd d:\uploadit
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repo and push
git remote add origin https://github.com/YOUR-USERNAME/uploadit.git
git branch -M main
git push -u origin main

# 3. Deploy on Render
# Go to https://dashboard.render.com and follow Step 4

# 4. Update environment variables (if needed)
# Backend CORS_ORIGIN → your frontend URL
# Frontend REACT_APP_API_URL → your backend URL

# 5. Push updates (automatic redeploy)
git push origin main
```

---

## 📚 Useful Render Commands (CLI)

### Install Render CLI

```bash
npm install -g render
```

### Login to Render

```bash
render login
```

### View Service Status

```bash
render services
```

### View Logs

```bash
render logs --service uploadit-backend --follow
```

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **GitHub**: https://github.com
- **Node.js**: https://nodejs.org

---

## ✨ Next Steps After Deployment

1. **Test All Features**
   - Upload files
   - Download files
   - Delete files
   - Test temporary storage

2. **Monitor Performance**
   - Check Render dashboard
   - Review service logs
   - Monitor disk usage

3. **Add Custom Domain** (Optional)
   - Go to service settings
   - Add your domain
   - Update DNS records

4. **Enable Persistent Storage** (Production)
   - Add Render Disk
   - Or integrate S3/Supabase

5. **Backup Uploads**
   - Regularly backup stored files
   - Consider using versioning

---

## 🎉 You're Deployed!

Congratulations! Upload.IT is now live on Render! 🚀

For questions or issues, check:
- Render documentation: https://render.com/docs
- Backend logs in Render dashboard
- Frontend browser console (F12)

---

**Last Updated**: 2026  
**Version**: 1.0.0
