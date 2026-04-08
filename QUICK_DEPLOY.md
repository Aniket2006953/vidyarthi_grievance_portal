# ⚡ QUICK START: Deploy in 15 Minutes

## BEFORE YOU START
- [ ] GitHub account (free at github.com)
- [ ] Render account (free at render.com)
- [ ] Your Gemini API key (if you have one)

---

## STEP 1: Install Git (If Not Already Installed)
Download from: https://git-scm.com/download/win
Just click "Next" through the installer

---

## STEP 2: Push to GitHub (5 minutes)

### 2.1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `vidyarthi-grievance-portal`
3. Description: `College Grievance Portal`
4. Select **PUBLIC**
5. Click **Create repository**
6. **Copy the URL shown** (looks like: `https://github.com/YOUR_USERNAME/vidyarthi-grievance-portal.git`)

### 2.2: Push Your Code
Open PowerShell/Command Prompt and run:

```powershell
cd C:\Users\USER\Downloads\vidyarthi-grievance-portal
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin [PASTE_YOUR_GITHUB_URL]
git push -u origin main
```

Replace `[PASTE_YOUR_GITHUB_URL]` with the URL from Step 2.1

---

## STEP 3: Deploy to Render (10 minutes)

### 3.1: Create Render Account
1. Go to https://render.com
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Render
5. Verify email

### 3.2: Deploy Application
1. Click **Dashboard**
2. Click **New +** → **Web Service**
3. Find and select: `vidyarthi-grievance-portal`
4. Click **Connect**

### 3.3: Configure Deployment
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `vidyarthi-portal` |
| **Region** | Choose closest (Asia/India: Singapore/Mumbai) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 3.4: Add Environment Variables
Scroll down to **Advanced Options** → **Add Environment Variable**

Add these:
```
DATABASE_URL = (your Render PostgreSQL URL - see step below)
GEMINI_API_KEY = (leave blank or add your key)
NODE_ENV = production
JWT_SECRET = college-complaint-secret-key
PORT = (leave blank - Render sets this automatically)
```

### 3.6: Set Up PostgreSQL Database
1. In Render Dashboard, click **New +** → **PostgreSQL**
2. Name it: `vidyarthi-db`
3. Click **Create Database**
4. Wait for it to be ready (2-3 minutes)
5. Go to your database → **Connections** tab
6. Copy the **External Database URL**
7. Go back to your Web Service → **Environment**
8. Add `DATABASE_URL` = [paste the PostgreSQL URL]

### 3.7: Deploy!
Click **Create Web Service** (or **Manual Deploy** → **Deploy latest commit** if already created)

**Wait 2-3 minutes...**

---

## STEP 4: Your App is Live! 🎉

When deployment finishes, you'll get a URL like:
```
https://vidyarthi-portal.onrender.com
```

**Open this link in browser** to access your live app!

---

## Testing Your Live App

1. Go to your Render URL
2. Click **Register**
3. Create a test account
4. Login
5. Try filing a complaint
6. Test uploading files

---

## If Something Goes Wrong

### Check Render Logs:
1. Go to Render Dashboard
2. Click your service name
3. Go to **Logs** tab
4. Look for errors

### Common Issues:

**"Cannot find module"**
→ Run this in Render settings:
```
Build Command: npm install && npm run build
```

**"Port already in use"**
→ This is handled automatically by Render

**"Database error"**
→ Your SQLite database is created automatically on first run

---

## Share Your App

Once deployed, share your Render URL with anyone:
```
https://vidyarthi-portal.onrender.com
```

They can register and use your app!

---

## Next Steps (Optional)

After app works:

1. **Get a Custom Domain:**
   - Buy domain from GoDaddy/Namecheap
   - Add to Render: Settings → Custom Domains
   - Update DNS (Render gives instructions)

2. **Auto-Deploy on Git Push:**
   - Automatically enabled!
   - Push code changes → Auto-deployed to Render

3. **Monitor Performance:**
   - Render Dashboard → Metrics tab
   - Check CPU, Memory usage

---

**Questions?** Check DEPLOYMENT_GUIDE.md in your project folder for detailed info.
