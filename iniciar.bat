@echo off
REM Inicia el backend (puerto 3000) y el frontend (puerto 5173) en dos ventanas.
REM Los datos del backend viven en memoria: cada reinicio vuelve al estado inicial de demostración.

cd /d "%~dp0Backend"
if not exist node_modules call npm install
start "Panchosky - Backend (3000)" cmd /k npm start

cd /d "%~dp0Frontend"
if not exist node_modules call npm install
start "Panchosky - Frontend (5173)" cmd /k npm run dev

timeout /t 6 >nul
start "" http://localhost:5173
