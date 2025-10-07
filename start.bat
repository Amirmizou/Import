@echo off
echo ========================================
echo   MicroImport Pro - Application Complete
echo ========================================
echo.

echo [1/3] Arret des processus existants...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak > nul

echo [2/3] Demarrage du Backend...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo [3/3] Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo [4/4] Demarrage du Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Application demarree avec succes!
echo.
echo 📊 Backend:  http://localhost:5000
echo 🎨 Frontend: http://localhost:5173
echo.
echo 🚀 Fonctionnalites disponibles:
echo - Authentification complete avec cookies securises
echo - Gestion des voyages avec calculs automatiques
echo - Frais fixes configurables par voyage
echo - Taux de change en temps reel
echo - Suggestions de prix intelligentes
echo - Calculs de benefices et ROI
echo - Respect des limites legales (1.8M DA/voyage)
echo - Gestion des marges (min/recommandee/optimale)
echo - Interface moderne et responsive
echo - Mode sombre/clair
echo - Protection des routes
echo - Gestion des erreurs
echo.
echo Structure:
echo - backend/ (Node.js + Express + MongoDB + JWT + Cookies)
echo - frontend/ (React + Vite + TailwindCSS + Logique Metier)
echo.
echo 💡 Logique metier integree:
echo - Calculs automatiques des coûts
echo - Gestion des devises multiples
echo - Frais de douane (5%)
echo - Frais fixes par voyage
echo - Suggestions de prix de vente
echo - Calculs de marge et ROI
echo - Respect du plafond legal
echo - Historique des voyages
echo - Statistiques en temps reel
echo.
echo 🎯 Utilisation:
echo 1. Inscrivez-vous ou connectez-vous
echo 2. Configurez vos taux de change et marges
echo 3. Creez vos voyages avec frais fixes
echo 4. Ajoutez vos marchandises
echo 5. Consultez vos statistiques
echo.
pause

