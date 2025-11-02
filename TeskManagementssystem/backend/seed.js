const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

const seedData = async (force = false) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management');
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    const existingTasks = await Task.countDocuments();
    
    if (existingUsers > 0 || existingTasks > 0) {
      if (!force) {
        console.log('\n⚠️  Database already contains data!');
        console.log(`   Users: ${existingUsers}, Tasks: ${existingTasks}`);
        console.log('   Skipping seed to preserve existing data.');
        console.log('   Use: node seed.js --force to clear and reseed\n');
        await mongoose.connection.close();
        return;
      } else {
        console.log('⚠️  Force flag detected - clearing existing data...');
      }
    }

    // Clear existing data only if force flag is set or no data exists
    if (force || (existingUsers === 0 && existingTasks === 0)) {
      await User.deleteMany({});
      await Task.deleteMany({});
      console.log('Cleared existing data');
    }

    // Create sample users with manually hashed passwords
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'manager'
      },
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created sample users');

    // Create sample tasks
    const tasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the task management system including API documentation and user guides.',
        status: 'in-progress',
        priority: 'high',
        assignedTo: createdUsers.find(u => u.email === 'user@example.com')._id,
        createdBy: createdUsers.find(u => u.email === 'admin@example.com')._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: ['documentation', 'project']
      },
      {
        title: 'Review code quality',
        description: 'Conduct a thorough code review of the frontend components and suggest improvements.',
        status: 'pending',
        priority: 'medium',
        assignedTo: createdUsers.find(u => u.email === 'jane@example.com')._id,
        createdBy: createdUsers.find(u => u.email === 'manager@example.com')._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        tags: ['code-review', 'quality']
      },
      {
        title: 'Fix authentication bug',
        description: 'Investigate and fix the JWT token expiration issue reported by users.',
        status: 'pending',
        priority: 'urgent',
        assignedTo: createdUsers.find(u => u.email === 'bob@example.com')._id,
        createdBy: createdUsers.find(u => u.email === 'admin@example.com')._id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        tags: ['bug-fix', 'authentication']
      },
      {
        title: 'Update user interface',
        description: 'Improve the user interface based on user feedback and make it more responsive.',
        status: 'completed',
        priority: 'medium',
        assignedTo: createdUsers.find(u => u.email === 'jane@example.com')._id,
        createdBy: createdUsers.find(u => u.email === 'manager@example.com')._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        tags: ['ui', 'improvement']
      },
      {
        title: 'Database optimization',
        description: 'Optimize database queries and add proper indexing for better performance.',
        status: 'in-progress',
        priority: 'high',
        assignedTo: createdUsers.find(u => u.email === 'user@example.com')._id,
        createdBy: createdUsers.find(u => u.email === 'admin@example.com')._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        tags: ['database', 'optimization']
      },
      {
        title: 'Write unit tests',
        description: 'Create comprehensive unit tests for all API endpoints and frontend components.',
        status: 'pending',
        priority: 'medium',
        assignedTo: createdUsers.find(u => u.email === 'bob@example.com')._id,
        createdBy: createdUsers.find(u => u.email === 'manager@example.com')._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        tags: ['testing', 'unit-tests']
      }
    ];

    await Task.insertMany(tasks);
    console.log('Created sample tasks');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample user credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Manager: manager@example.com / manager123');
    console.log('User: user@example.com / user123');
    console.log('User: jane@example.com / user123');
    console.log('User: bob@example.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Check if --force flag is passed
const force = process.argv.includes('--force');
seedData(force);
