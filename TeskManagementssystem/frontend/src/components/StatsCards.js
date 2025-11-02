import React from 'react';

const StatsCards = ({ tasks = [] }) => {
  const stats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    cancelled: tasks.filter(task => task.status === 'cancelled').length,
    urgent: tasks.filter(task => task.priority === 'urgent').length,
    high: tasks.filter(task => task.priority === 'high').length,
    overdue: tasks.filter(task => 
      new Date(task.dueDate) < new Date() && 
      !['completed', 'cancelled'].includes(task.status)
    ).length
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: '📋',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: '⏳',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: '🔄',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: '❌',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Urgent',
      value: stats.urgent,
      icon: '🚨',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'High Priority',
      value: stats.high,
      icon: '🔴',
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: '⚠️',
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-2 rounded-lg ${stat.color} bg-opacity-10`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className={`text-2xl font-semibold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;


