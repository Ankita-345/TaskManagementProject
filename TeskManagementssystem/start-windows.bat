@echo off
echo ========================================
echo Task Management System - Windows Setup
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Minimum version required: 14.x
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

:: Check if MongoDB is running (optional check)
echo Checking MongoDB connection...
timeout /t 2 >nul

:: Store project root path
set PROJECT_ROOT=%CD%

:: Navigate to backend directory
cd backend
set BACKEND_DIR=%CD%

:: Check if node_modules exists and nodemon is installed
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    :: Verify nodemon is installed
    if not exist "node_modules\nodemon" (
        echo [WARNING] Dependencies may be incomplete. Reinstalling...
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Failed to install backend dependencies
            pause
            exit /b 1
        )
    )
)

:: Check if .env exists
if not exist ".env" (
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/task-management
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NODE_ENV=development
    ) > .env
    echo [INFO] Created .env file. Please update MONGODB_URI if using MongoDB Atlas
)

:: Seed database
echo Seeding database...
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Database seeding failed. Continuing anyway...
)

:: Start backend in new window
echo Starting backend server...
start "Backend Server" cmd /k "cd /d %BACKEND_DIR% && npm run dev"

:: Wait a bit for backend to start
timeout /t 3 >nul

:: Navigate to frontend directory
cd ..\frontend
set FRONTEND_DIR=%CD%

:: Check if node_modules exists and react-scripts is installed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    :: Verify react-scripts is installed
    if not exist "node_modules\react-scripts" (
        echo [WARNING] Dependencies may be incomplete. Reinstalling...
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Failed to install frontend dependencies
            pause
            exit /b 1
        )
    )
)

:: Check if .env exists
if not exist ".env" (
    echo Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000
    ) > .env
)

:: Start frontend in new window
echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d %FRONTEND_DIR% && npm start"

:: Wait a bit for frontend to start
timeout /t 5 >nul

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Sample Login Credentials:
echo   Admin:   admin@example.com / admin123
echo   Manager: manager@example.com / manager123
echo   User:    user@example.com / user123
echo.
echo The application will open in your browser automatically.
echo Close the terminal windows to stop the servers.
echo.
pause
