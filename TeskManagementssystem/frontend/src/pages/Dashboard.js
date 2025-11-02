import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Calendar from '../components/Calendar';
import UserManagement from '../components/UserManagement';
import StatsCards from '../components/StatsCards';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    setEditingTask(null);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const tabs = [
    { id: 'tasks', name: 'Tasks', icon: '📋' },
    { id: 'calendar', name: 'Calendar', icon: '📅' },
  ];

  if (hasRole(['admin', 'manager'])) {
    tabs.push({ id: 'users', name: 'Users', icon: '👥' });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
              {hasRole(['admin', 'manager']) && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary"
                >
                  Create Task
                </button>
              )}
            </div>
            <TaskList 
              tasks={tasks}
              loading={loading}
              onEdit={setEditingTask}
              onDelete={handleTaskDeleted}
              onUpdate={handleTaskUpdated}
            />
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
            <Calendar tasks={tasks} />
          </div>
        );
      case 'users':
        return hasRole(['admin']) ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <UserManagement />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  if (showTaskForm || editingTask) {
    return (
      <TaskForm
        task={editingTask}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSuccess={editingTask ? handleTaskUpdated : handleTaskCreated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Task Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards tasks={tasks} />

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


