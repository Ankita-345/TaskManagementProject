const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticateToken, authorize, canAccessTask } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get tasks based on user role
// @access  Private
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, priority, search } = req.query;

    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'user') {
      // Users can only see tasks assigned to them
      query.assignedTo = req.user._id;
    } else if (req.user.role === 'manager') {
      // Managers can see all tasks (in real app, filter by team)
      // For now, show all tasks
    }
    // Admins can see all tasks (no additional filter)

    // Apply filters
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', authenticateToken, canAccessTask, async (req, res) => {
  try {
    res.json({ task: req.task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private (Admin, Manager)
router.post('/', authenticateToken, authorize('admin', 'manager'), [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('assignedTo').isMongoId().withMessage('Valid assignedTo ID required'),
  body('dueDate').isISO8601().withMessage('Valid due date required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, assignedTo, dueDate, priority = 'medium', tags = [] } = req.body;

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      dueDate: new Date(dueDate),
      priority,
      tags
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authenticateToken, canAccessTask, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date required'),
  body('assignedTo').optional().isMongoId().withMessage('Valid assignedTo ID required'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, status, priority, dueDate, assignedTo, tags } = req.body;
    const task = req.task;

    // Check permissions for different fields
    if (assignedTo && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only admins and managers can reassign tasks' });
    }

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      const oldStatus = task.status;
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      } else if (oldStatus === 'completed' && status !== 'completed') {
        task.completedAt = undefined;
      }
    }
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (assignedTo) task.assignedTo = assignedTo;
    if (tags !== undefined) task.tags = tags;

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, canAccessTask, authorize('admin'), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/calendar/:year/:month
// @desc    Get tasks for calendar view
// @access  Private
router.get('/calendar/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Build query based on user role
    let query = {
      dueDate: {
        $gte: startDate,
        $lte: endDate
      }
    };
    
    if (req.user.role === 'user') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get calendar tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


