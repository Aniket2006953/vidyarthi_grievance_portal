@echo off
echo.
echo ============================================
echo GITHUB SETUP SCRIPT
echo ============================================
echo.
echo Step 1: Go to https://github.com/new
echo Step 2: Create a NEW repository named: vidyarthi-grievance-portal
echo Step 3: Choose PUBLIC (important for free deployment)
echo Step 4: Click "Create repository"
echo Step 5: Copy the repository URL (looks like https://github.com/YOUR_USERNAME/vidyarthi-grievance-portal.git)
echo.
echo After you create the repo, come back and follow these commands:
echo.
echo ============================================
echo COMMANDS TO RUN:
echo ============================================
echo.
echo cd C:\Users\USER\Downloads\vidyarthi-grievance-portal
echo git init
echo git add .
echo git commit -m "Initial commit: Vidyarthi Grievance Portal"
echo git branch -M main
echo git remote add origin [PASTE_YOUR_GITHUB_URL_HERE]
echo git push -u origin main
echo.
echo ============================================
echo.
pause
