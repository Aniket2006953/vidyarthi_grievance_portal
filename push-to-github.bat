@echo off
REM GitHub Push Script for Vidyarthi Grievance Portal

cd /d "C:\Users\USER\Downloads\vidyarthi-grievance-portal"

echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Creating first commit...
git commit -m "Initial commit: Vidyarthi Grievance Portal"

echo.
echo ===============================================
echo NEXT STEPS:
echo ===============================================
echo 1. Go to https://github.com/new
echo 2. Create a new repository named 'vidyarthi-grievance-portal'
echo 3. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/vidyarthi-grievance-portal.git)
echo 4. Come back here and run:
echo    git remote add origin [paste-your-url-here]
echo    git push -u origin main
echo.
pause
