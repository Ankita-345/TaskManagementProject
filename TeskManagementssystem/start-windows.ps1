Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task Management System - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Minimum version required: 14.x" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check MongoDB connection (optional)
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Backend setup
Write-Host "Setting up backend..." -ForegroundColor Cyan
Set-Location -Path "backend"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install backend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    @"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "[INFO] Created .env file. Please update MONGODB_URI if using MongoDB Atlas" -ForegroundColor Yellow
}

# Seed database
Write-Host "Seeding database..." -ForegroundColor Yellow
npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Database seeding failed. Continuing anyway..." -ForegroundColor Yellow
}

# Start backend in new window
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Start-Sleep -Seconds 3

# Frontend setup
Write-Host "Setting up frontend..." -ForegroundColor Cyan
Set-Location -Path "../frontend"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install frontend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    "REACT_APP_API_URL=http://localhost:5000" | Out-File -FilePath ".env" -Encoding UTF8
}

# Start frontend in new window
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm start"

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sample Login Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:   admin@example.com / admin123" -ForegroundColor White
Write-Host "  Manager: manager@example.com / manager123" -ForegroundColor White
Write-Host "  User:    user@example.com / user123" -ForegroundColor White
Write-Host ""
Write-Host "The application will open in your browser automatically." -ForegroundColor Green
Write-Host "Close the terminal windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"

