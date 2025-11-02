# Role-Based Task Management System

A full-stack web application built with React (frontend) and Node.js (backend) that implements a role-based authentication system for managing tasks. The application allows users with different roles (Admin, Manager, User) to have different levels of access and functionality.

## 🚀 Quick Start for Windows Users

### **Easiest Method - One-Click Setup:**

1. **Install Prerequisites:**
   - Node.js: https://nodejs.org/ (LTS version)
   - MongoDB: https://www.mongodb.com/try/download/community OR use MongoDB Atlas (cloud - no installation needed)

2. **Run Setup Script:**
   - Double-click `start-windows.bat` in the project folder
   - OR run `.\start-windows.ps1` in PowerShell

3. **Access Application:**
   - Browser will open automatically to `http://localhost:3000`
   - Login with: `admin@example.com` / `admin123`

**For detailed Windows instructions, see [WINDOWS-SETUP.md](./WINDOWS-SETUP.md)**

---

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, User)
- Secure password hashing with bcrypt
- Protected routes based on user roles

### 📋 Task Management
- Create, edit, delete, and assign tasks
- Task status tracking (Pending, In Progress, Completed, Cancelled)
- Priority levels (Low, Medium, High, Urgent)
- Due date management
- Task tagging system
- Search and filter functionality

### 👥 User Management (Admin Only)
- Create and manage user accounts
- Role assignment and updates
- User statistics and overview

### 📅 Calendar Integration
- FullCalendar integration for task visualization
- Month, week, and day views
- Task display based on due dates
- Role-based calendar access
- Interactive task details

### 📊 Dashboard & Analytics
- Role-specific dashboard views
- Task statistics and metrics
- Real-time data updates

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **FullCalendar** - Calendar component
- **Headless UI** - Accessible UI components

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TeskManagementssystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (if not running as a service)
mongod
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on http://localhost:5000

### 2. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend application will start on http://localhost:3000

## Sample User Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin

### Manager Account
- **Email:** manager@example.com
- **Password:** manager123
- **Role:** Manager

### User Account
- **Email:** user@example.com
- **Password:** user123
- **Role:** User

*Note: You can create these accounts through the registration page or they will be created automatically when you first run the application.*

## User Roles & Permissions

### Admin
- ✅ Create, edit, delete, and assign tasks
- ✅ Manage user accounts (create, edit, delete users)
- ✅ View all tasks across the system
- ✅ Access user management dashboard
- ✅ Full calendar access

### Manager
- ✅ Create and assign tasks to users
- ✅ View and update tasks for their team
- ✅ Access calendar view
- ❌ Cannot manage user accounts
- ❌ Cannot delete tasks

### User
- ✅ View and update only their own tasks
- ✅ Change task status
- ✅ Access calendar view for their tasks
- ❌ Cannot create or assign tasks
- ❌ Cannot access user management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get tasks (with pagination and filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task (Admin/Manager only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin/Manager only)
- `GET /api/tasks/calendar/:year/:month` - Get tasks for calendar

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics

## Project Structure

```
TeskManagementssystem/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskList.js
│   │   │   ├── TaskForm.js
│   │   │   ├── Calendar.js
│   │   │   ├── UserManagement.js
│   │   │   └── StatsCards.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts development server with hot reload
```

## Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static file server
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team.

