# RENDER DEPLOYMENT - COMMAND-BY-COMMAND GUIDE

## Copy & Paste Ready Commands

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 1: INITIALIZE GIT REPOSITORY
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```bash
cd d:\uploadit
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial Upload.IT commit"
```

```bash
git status
```

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 2: PUSH TO GITHUB
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**First:** Create repo at https://github.com/new (name: uploadit)

**Then run:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/uploadit.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

```bash
git remote -v
```

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 3: DEPLOY ON RENDER (Dashboard)
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Via Browser (Manual):**

1. Go to: https://dashboard.render.com
2. Click: New +
3. Select: Web Service
4. Click: Connect Account (GitHub)
5. Select: uploadit repository
6. Click: Connect

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 4A: CREATE BACKEND SERVICE
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Fill in these values:**

| Field | Value |
|-------|-------|
| Name | `uploadit-backend` |
| Root Directory | `backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | `Free` |

**Environment Variables:**
- KEY: `NODE_ENV` | VALUE: `production`
- KEY: `PORT` | VALUE: `10000`

Click: Create Web Service

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 4B: CREATE FRONTEND SERVICE
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go to Render dashboard again and:

1. Click: New +
2. Select: Web Service
3. Select: uploadit repository (again)

**Fill in these values:**

| Field | Value |
|-------|-------|
| Name | `uploadit-frontend` |
| Root Directory | `frontend` |
| Environment | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | `Free` |

**Environment Variables:**
- KEY: `REACT_APP_API_URL` | VALUE: `https://uploadit-backend.onrender.com`

Click: Create Web Service

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 5: CONFIGURE CORS
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After both services are deployed:

1. Go to: Dashboard → uploadit-backend service
2. Click: Settings
3. Scroll to: Environment
4. Add Environment Variable:
   - KEY: `CORS_ORIGIN`
   - VALUE: `https://uploadit-frontend.onrender.com`
5. Click: Save

The backend will automatically redeploy with new CORS settings.

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 6: TEST DEPLOYMENT
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Test API Health:**

```bash
curl https://uploadit-backend.onrender.com/api/health
```

**Visit Frontend:**

Open browser to: https://uploadit-frontend.onrender.com

**Test Features:**
1. Upload a file
2. Copy preview link
3. Test download
4. Test deletion

---

### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### STEP 7: DEPLOY UPDATES (FUTURE)
### ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After making code changes:

```bash
cd d:\uploadit
```

```bash
git add .
```

```bash
git commit -m "Your changes description"
```

```bash
git push origin main
```

Render automatically redeploys!

---

## 📋 USEFUL COMMANDS

### Check Git Status
```bash
git status
```

### View Commit History
```bash
git log --oneline
```

### View Remote
```bash
git remote -v
```

### Undo Last Commit (if needed)
```bash
git reset --soft HEAD~1
```

### Check What's Staged
```bash
git diff --staged
```

---

## 🔗 QUICK LINKS

| What | Where |
|------|-------|
| Create GitHub Repo | https://github.com/new |
| Render Dashboard | https://dashboard.render.com |
| Your Frontend | https://uploadit-frontend.onrender.com |
| Your Backend | https://uploadit-backend.onrender.com |
| API Health Check | https://uploadit-backend.onrender.com/api/health |

---

## ⚡ FULL WORKFLOW (Copy & Paste)

```bash
# Step 1: Setup local repo
cd d:\uploadit
git init
git add .
git commit -m "Initial Upload.IT commit"

# Step 2: Push to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/uploadit.git
git branch -M main
git push -u origin main

# Step 3: (Via Render Dashboard)
# - Connect GitHub
# - Create backend service (root: backend, start: npm start)
# - Create frontend service (root: frontend, start: npm start)
# - Set environment variables
# - Set CORS_ORIGIN on backend

# Step 4: Test
curl https://uploadit-backend.onrender.com/api/health
# Open https://uploadit-frontend.onrender.com

# Step 5: Future updates
git add .
git commit -m "Changes"
git push origin main
# Auto redeploy!
```

---

## 🆘 TROUBLESHOOTING

### Service Won't Start
- Check logs on Render dashboard
- Verify start command is correct
- Check package.json exists in service root

### Can't Push to GitHub
```bash
# Check remote is correct
git remote -v

# Fix if wrong
git remote set-url origin https://github.com/YOUR-USERNAME/uploadit.git

# Try again
git push -u origin main
```

### Files Not Uploading
- Check backend logs on Render
- Verify CORS_ORIGIN is set correctly
- Check REACT_APP_API_URL on frontend
- Test health endpoint: curl https://uploadit-backend.onrender.com/api/health

### Build Fails
- Check Render build logs
- Verify package.json has all dependencies
- Try rebuilding manually in Render dashboard

---

**Last Updated**: 2026-05-31  
**Version**: 1.1.0
