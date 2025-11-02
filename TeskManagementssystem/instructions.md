Assignment: Role-Based Task Management System
Objective
Develop a full-stack web application using React (frontend) and Node.js (backend) that implements a role-based
authentication system for managing tasks. The application should allow users with different roles (Admin,
Manager, User) to have different levels of access and functionality.

Requirements
Roles & Permissions
• Admin: Create, edit, delete, and assign tasks. Manage user accounts. View all tasks.
• Manager: Create and assign tasks to users. View and update tasks for their team.
• User: View and update only their own tasks. Change task status.
Authentication & Authorization
• Use JWT (JSON Web Token) for authentication.
• Hash passwords using bcrypt.
• Role-based authorization for protected routes.
• Public routes: /login, /signup.
• Private routes: Task management and user management (based on role).
Backend (Node.js + Express + MongoDB)
• User Model: Name, Email, Password (hashed), Role.
• Task Model: Title, Description, Status, AssignedTo, CreatedBy, timestamps.
• REST APIs for authentication, tasks, and user management.
• Middleware for authentication and role-based access control.
Frontend (React + Tailwind or CSS Framework)
• Login & Signup pages.
• Dashboard with role-specific views.
• Task list with filters and search.
• Task create/edit form.
• User management page (Admin only).
• React Router for navigation.
• Axios for API calls.
• Role-based UI rendering.
Additional Requirements
• Error handling on both backend and frontend.
• Form validation.
• Use dotenv for environment variables.
• Include README with setup instructions.
• Bonus: Implement pagination & search for tasks.
Calender Functionality
● Implement a calendar view where tasks are displayed on their respective due dates.
● Each task should be visible on the calendar based on its assigned or due date.
● Users should be able to click on a date to view all tasks scheduled for that day.
● Provide month, week, and day views in the calendar.
● Use libraries like FullCalendar (React) for frontend implementation.
● Ensure role-based access applies in the calendar view (Admins see all tasks, Managers see team tasks,
Users can see only user specific tasks)
Submission Guidelines
Push the project to a GitHub repository. Include instructions to run both backend and frontend. Provide sample
credentials for Admin, Manager, and User roles in the README.

Evaluation Criteria
• Functionality – Meets all requirements.
• Code Quality – Clean, modular, and maintainable code.
• UI/UX – Intuitive and responsive design.
• Security – Proper authentication & authorization.
• Documentation – Clear README and comments