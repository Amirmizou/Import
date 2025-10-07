@echo off
echo ========================================
echo   MICROIMPORT PRO - DEMARRAGE LOCAL
echo ========================================
echo.

echo Configuration des variables d'environnement...
set NODE_ENV=development
set PORT=5000
set MONGODB_URI=mongodb://localhost:27017/microimport
set JWT_SECRET=dev_secret_key_change_in_production
set CORS_ORIGIN=http://localhost:5173
set CLIENT_URL=http://localhost:5173

echo.
echo Variables configurees:
echo - NODE_ENV: %NODE_ENV%
echo - PORT: %PORT%
echo - CORS_ORIGIN: %CORS_ORIGIN%
echo.

echo Demarrage du backend...
cd backend
start "Backend" cmd /k "npm run dev"

echo.
echo Attente du demarrage du backend...
timeout /t 3 /nobreak > nul

echo.
echo Demarrage du frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   APPLICATIONS DEMARREES
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer...
pause > nul

