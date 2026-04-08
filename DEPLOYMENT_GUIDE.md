# 🚀 DEPLOYMENT GUIDE - Vidyarthi Grievance Portal

## Choose Your Hosting Platform

### Option A: RENDER (Recommended) 
- Best for full-stack Node.js apps
- Free tier available
- PostgreSQL database included
- Easy GitHub integration

### Option B: RAILWAY
- Great for full-stack
- Simple deployment from GitHub
- Free trial ($5 credit)

### Option C: VERCEL + Separate Backend
- Frontend on Vercel
- Backend API on Render/Railway
- More complex setup

---

## DETAILED STEPS FOR RENDER DEPLOYMENT

### PHASE 1: GitHub Setup (5 minutes)

1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up

2. **Create New Repository**
   - Click **+** icon → **New repository**
   - Name: `vidyarthi-grievance-portal`
   - Description: `College Student Grievance Portal`
   - Choose **PUBLIC** (important!)
   - Click **Create repository**

3. **Get Your Repository URL**
   - After creating, you'll see: `https://github.com/YOUR_USERNAME/vidyarthi-grievance-portal.git`
   - Copy this URL

4. **Push Your Code to GitHub**
   - Download Git from: https://git-scm.com/download/win
   - Install it (just click Next throughout)
   - Open Command Prompt/PowerShell
   - Run these commands:

```bash
cd C:\Users\USER\Downloads\vidyarthi-grievance-portal
git init
git add .
git commit -m "Initial commit: Vidyarthi Grievance Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vidyarthi-grievance-portal.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

---

### PHASE 2: Render Deployment (10 minutes)

1. **Create Render Account**
   - Go to https://render.com
   - Click **Sign Up**
   - Sign up with GitHub (easiest)
   - Authorize Render

2. **Create Web Service**
   - Dashboard → **New +** → **Web Service**
   - Select your GitHub repository: `vidyarthi-grievance-portal`
   - Click **Connect**

3. **Configure Service**
   - **Name:** `vidyarthi-portal`
   - **Region:** Choose closest (e.g., Singapore, Mumbai, US East)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` or `tsx backend/server.ts`

4. **Environment Variables** 
   - Click **Advanced** 
   - Add these variables:
     - `GEMINI_API_KEY` = [Your API key]
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = `college-complaint-secret-key`

5. **Database Setup**
   - Render supports SQLite on disk
   - Your existing `college_complaints.db` will be preserved
   - Database file is stored in `/var/data/college_complaints.db`

6. **Deploy**
   - Click **Create Web Service**
   - Wait 2-3 minutes for deployment
   - Get your live URL: `https://vidyarthi-portal.onrender.com`

---

### PHASE 3: Update Frontend API URL

After deployment, update your API calls:

**File:** `src/lib/api.ts`

Change:
```typescript
const API_BASE = 'http://localhost:3000/api';
```

To:
```typescript
const API_BASE = process.env.VITE_API_URL || 'https://vidyarthi-portal.onrender.com/api';
```

Add environment variable in deployment:
- `VITE_API_URL` = `https://your-render-app.onrender.com/api`

---

## Final Checklist

- [ ] GitHub account created
- [ ] Repository created
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service deployed
- [ ] Environment variables set
- [ ] App accessible at Render URL
- [ ] Test login, registration, file upload
- [ ] Test database functionality

---

## Live App URL After Deployment

You'll get: **https://vidyarthi-portal.onrender.com**

Share this link with anyone to access your app!

---

## Troubleshooting

**App not starting?**
- Check Render logs → Deployments → Click latest
- Look for error messages
- Check environment variables are set

**Database errors?**
- Render creates `/var/data/` directory automatically
- SQLite database will be created on first run
- Check server.ts logs

**Static files not loading?**
- Make sure `npm run build` is in build command
- Check vite.config.ts for correct paths

---

## Next: Deploy to Production with Custom Domain

After app is working on Render:
1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Render dashboard: Settings → Custom Domains
3. Add your domain
4. Update DNS records as shown
5. Your app is now at: **yourdomainname.com**

---
