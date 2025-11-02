#!/bin/bash

echo "🚀 Starting Task Management System Setup..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    echo ""
    read -p "Press Enter to continue after starting MongoDB..."
fi

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file for backend..."
    cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOL
fi

# Seed the database only if it's empty (won't overwrite existing data)
echo "🌱 Checking database and seeding if needed..."
node seed.js

# Start backend in background
echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file for frontend..."
    cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000
EOL
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Sample user credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   Manager: manager@example.com / manager123"
echo "   User: user@example.com / user123"
echo ""
echo "🌐 Starting frontend development server..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Start frontend
npm start

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM


