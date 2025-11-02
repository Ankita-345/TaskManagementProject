# Windows Setup Guide - Task Management System

## 🚀 Quick Start (Easiest Method)

### **Step 1: Install Prerequisites**

1. **Install Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Choose LTS version
   - Run installer with default settings

2. **Install MongoDB** (Choose ONE option):

   **Option A: MongoDB Community Server** (Local)
   - Download from: https://www.mongodb.com/try/download/community
   - Run installer
   - Install as Windows Service (recommended)

   **Option B: MongoDB Atlas** (Cloud - Recommended - No installation needed!)
   - Go to: https://www.mongodb.com/atlas
   - Sign up (free)
   - Create free cluster
   - Get connection string

### **Step 2: Run the Setup Script**

#### **Method 1: Using Batch File (Easiest)**
1. Open File Explorer
2. Navigate to project folder
3. Double-click `start-windows.bat`
4. Wait for setup to complete

#### **Method 2: Using PowerShell**
1. Right-click in project folder
2. Select "Open PowerShell window here"
3. Run: `.\start-windows.ps1`
4. Wait for setup to complete

#### **Method 3: Manual Setup**
If scripts don't work, follow manual steps below.

### **Step 3: Access the Application**

1. Wait for both servers to start (you'll see two terminal windows)
2. Browser should open automatically to `http://localhost:3000`
3. If not, manually open: `http://localhost:3000`

### **Step 4: Login**

Use these sample credentials:
- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **User**: user@example.com / user123

---

## 📋 Manual Setup (If Scripts Don't Work)

### **Step 1: Open Two Terminal Windows**

Open Command Prompt or PowerShell:
- **Terminal 1** for Backend
- **Terminal 2** for Frontend

### **Step 2: Backend Setup (Terminal 1)**

```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

If using MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
```

Seed the database:
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

### **Step 3: Frontend Setup (Terminal 2)**

```bash
cd frontend
npm install
```

Create `.env` file in `frontend` folder:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3000
```

### **Step 4: Access Application**

Open browser: `http://localhost:3000`

---

## 🔧 Troubleshooting Windows Issues

### **Issue: "Node.js is not recognized"**
**Solution:**
1. Reinstall Node.js
2. Check "Add to PATH" during installation
3. Restart terminal/computer

### **Issue: "MongoDB connection failed"**
**Solution:**
- Check if MongoDB service is running
- Use MongoDB Atlas (cloud) instead
- Update `.env` with Atlas connection string

### **Issue: "Port 3000/5000 already in use"**
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <process_id> /F
```

### **Issue: "npm install fails"**
**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### **Issue: PowerShell script won't run**
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Issue: "Cannot find module"**
**Solution:**
- Make sure you're in the correct directory
- Run `npm install` in both backend and frontend folders

---

## 🎯 VS Code Setup (Optional)

### **Recommended Extensions:**
1. ES7+ React/Redux/React-Native snippets
2. Prettier - Code formatter
3. ESLint
4. MongoDB for VS Code
5. REST Client

### **Workspace Settings:**
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.env": "dotenv"
  }
}
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB installed/running OR Atlas connection string ready
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Database seeded (`cd backend && npm run seed`)
- [ ] Backend running (`http://localhost:5000/api/health`)
- [ ] Frontend running (`http://localhost:3000`)
- [ ] Can login with sample credentials

---

## 🎉 Success!

Once everything is running:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Login**: admin@example.com / admin123

Enjoy your Task Management System! 🚀

