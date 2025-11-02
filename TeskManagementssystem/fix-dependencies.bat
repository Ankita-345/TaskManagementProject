@echo off
echo ========================================
echo Fixing Dependencies
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

:: Backend dependencies
echo ========================================
echo Fixing Backend Dependencies
echo ========================================
cd backend

echo Removing old node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
)

echo Removing package-lock.json...
if exist "package-lock.json" (
    del /f /q "package-lock.json"
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [OK] Backend dependencies installed
echo.

:: Frontend dependencies
echo ========================================
echo Fixing Frontend Dependencies
echo ========================================
cd ..\frontend

echo Removing old node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
)

echo Removing package-lock.json...
if exist "package-lock.json" (
    del /f /q "package-lock.json"
)

echo Installing frontend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [OK] Frontend dependencies installed
echo.

echo ========================================
echo Dependencies Fixed!
echo ========================================
echo.
echo You can now run start-windows.bat
echo.
pause


