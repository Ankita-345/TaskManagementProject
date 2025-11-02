import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { tasksAPI } from '../services/api';

const Calendar = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasksForMonth(currentDate);
  }, [currentDate]);

  const fetchTasksForMonth = async (date) => {
    try {
      setLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const response = await tasksAPI.getCalendarTasks(year, month);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching calendar tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626'; // red-600
      case 'high':
        return '#ea580c'; // orange-600
      case 'medium':
        return '#d97706'; // amber-600
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#059669'; // emerald-600
      case 'in-progress':
        return '#2563eb'; // blue-600
      case 'cancelled':
        return '#dc2626'; // red-600
      default:
        return '#d97706'; // amber-600
    }
  };

  const formatTasksForCalendar = () => {
    return tasks.map(task => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      allDay: true,
      backgroundColor: getPriorityColor(task.priority),
      borderColor: getStatusColor(task.status),
      textColor: '#ffffff',
      extendedProps: {
        task: task
      }
    }));
  };

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    const tasksOnDate = tasks.filter(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === clickedDate;
    });

    if (tasksOnDate.length > 0) {
      alert(`Tasks on ${clickedDate}:\n\n${tasksOnDate.map(task => 
        `• ${task.title} (${task.status}) - Assigned to: ${task.assignedTo.name}`
      ).join('\n')}`);
    }
  };

  const handleEventClick = (info) => {
    const task = info.event.extendedProps.task;
    alert(`Task: ${task.title}\n\nDescription: ${task.description}\n\nStatus: ${task.status}\nPriority: ${task.priority}\nAssigned to: ${task.assignedTo.name}\nCreated by: ${task.createdBy.name}`);
  };

  const handleDatesSet = (dateInfo) => {
    const newDate = new Date(dateInfo.start);
    if (newDate.getMonth() !== currentDate.getMonth() || 
        newDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(newDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Legend */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getPriorityColor('urgent') }}></div>
                <span className="text-sm text-gray-600">Urgent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getPriorityColor('high') }}></div>
                <span className="text-sm text-gray-600">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getPriorityColor('medium') }}></div>
                <span className="text-sm text-gray-600">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getPriorityColor('low') }}></div>
                <span className="text-sm text-gray-600">Low</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status (Border)</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2" style={{ borderColor: getStatusColor('pending') }}></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2" style={{ borderColor: getStatusColor('in-progress') }}></div>
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2" style={{ borderColor: getStatusColor('completed') }}></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded border-2" style={{ borderColor: getStatusColor('cancelled') }}></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={formatTasksForCalendar()}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventDidMount={(info) => {
            // Add tooltip
            info.el.title = `${info.event.title} - ${info.event.extendedProps.task.status}`;
          }}
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to use the calendar:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any date to see tasks scheduled for that day</li>
          <li>• Click on any task event to see detailed information</li>
          <li>• Use the view buttons to switch between month, week, and day views</li>
          <li>• Task background color indicates priority, border color indicates status</li>
        </ul>
      </div>
    </div>
  );
};

export default Calendar;


