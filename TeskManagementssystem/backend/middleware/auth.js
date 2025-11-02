const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Check if user can access task (assigned to them or they created it, or admin/manager)
const canAccessTask = async (req, res, next) => {
  try {
    const taskId = req.params.id || req.params.taskId;
    const Task = require('../models/Task');
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admin can access all tasks
    if (req.user.role === 'admin') {
      req.task = task;
      return next();
    }

    // Manager can access tasks they created or assigned to their team
    if (req.user.role === 'manager') {
      // For now, managers can access all tasks (in real app, you'd check team membership)
      req.task = task;
      return next();
    }

    // User can only access tasks assigned to them or created by them
    if (task.assignedTo.toString() === req.user._id.toString() || 
        task.createdBy.toString() === req.user._id.toString()) {
      req.task = task;
      return next();
    }

    return res.status(403).json({ message: 'Access denied to this task' });
  } catch (error) {
    console.error('Task access middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  authenticateToken,
  authorize,
  canAccessTask
};


