@echo off
set PORT=8000
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0.*0.0.0.0') do set IP=%%a
echo ========================================
echo PSX Player Server is Running
echo Point your PS5 Browser to: http://%IP%:%PORT%
echo ========================================
python -m http.server %PORT%
pause