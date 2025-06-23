import { useState, useEffect } from 'react';
import { ClipboardList, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/hooks/use-notifications';
import { storage } from '@/lib/storage';
import { Task } from '@/types/timer';

export function TaskScheduler() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    date: '',
    time: '',
  });
  
  const { showNotification, requestPermission, isGranted } = useNotifications();

  useEffect(() => {
    setTasks(storage.getTasks());
    
    if (!isGranted) {
      requestPermission();
    }
  }, [isGranted, requestPermission]);

  useEffect(() => {
    // Check for task notifications every minute
    const checkNotifications = () => {
      const now = new Date();
      const currentDateTime = now.toISOString();
      
      tasks.forEach(task => {
        if (task.status === 'scheduled' && task.datetime <= currentDateTime) {
          if (isGranted) {
            showNotification('Task Reminder', {
              body: task.title,
              tag: `task-${task.id}`,
            });
          }
          
          // Mark as overdue
          storage.updateTaskStatus(task.id, 'overdue');
          setTasks(storage.getTasks());
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    checkNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [tasks, isGranted, showNotification]);

  const getTaskStatus = (task: Task): 'scheduled' | 'today' | 'overdue' => {
    const now = new Date();
    const taskDate = new Date(task.datetime);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

    if (taskDate < now) {
      return 'overdue';
    } else if (taskDateOnly.getTime() === today.getTime()) {
      return 'today';
    } else {
      return 'scheduled';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <span className="px-2 py-1 bg-red-400 text-white text-xs rounded-full">Overdue</span>;
      case 'today':
        return <span className="px-2 py-1 bg-blue-400 text-white text-xs rounded-full">Today</span>;
      default:
        return <span className="px-2 py-1 bg-green-400 text-white text-xs rounded-full">Scheduled</span>;
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.date || !newTask.time) {
      return;
    }

    const datetime = `${newTask.date}T${newTask.time}:00`;
    
    // Check if the task is in the past
    const taskDate = new Date(datetime);
    const now = new Date();
    
    if (taskDate < now) {
      alert('Cannot schedule a task in the past. Please choose a future date and time.');
      return;
    }

    const task = storage.addTask({
      title: newTask.title.trim(),
      date: newTask.date,
      time: newTask.time,
      datetime,
    });

    setTasks(storage.getTasks());
    setNewTask({ title: '', date: '', time: '' });
    setShowAddForm(false);

    // Request notification permission if not granted
    if (!isGranted) {
      const granted = await requestPermission();
      if (!granted) {
        alert('Notifications disabled. Enable them in your browser settings to get task reminders.');
        return;
      }
    }

    // Show immediate confirmation
    if (isGranted) {
      showNotification('Task Scheduled', {
        body: `"${task.title}" scheduled for ${taskDate.toLocaleString()}`,
        tag: `task-scheduled-${task.id}`,
      });
    }

    // Schedule the actual reminder
    const timeUntilTask = taskDate.getTime() - now.getTime();
    if (timeUntilTask > 0 && timeUntilTask <= 86400000) { // Only schedule if within 24 hours
      setTimeout(() => {
        if (isGranted) {
          showNotification('Task Reminder', {
            body: `Time for: ${task.title}`,
            tag: `task-reminder-${task.id}`,
            requireInteraction: true,
          });
        }
      }, timeUntilTask);
    }
  };

  const handleDeleteTask = (id: string) => {
    storage.deleteTask(id);
    setTasks(storage.getTasks());
  };

  const getTaskStats = () => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => getTaskStatus(t) === 'overdue').length;
    const pending = tasks.filter(t => t.status === 'scheduled').length;
    
    return { completed, pending, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-amber-400" />
          Task Scheduler
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full bg-amber-400 hover:bg-amber-500 text-white p-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-700 rounded-xl border-l-4 border-amber-400">
          <Input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="mb-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-amber-400"
          />
          <div className="flex space-x-2">
            <Input
              type="date"
              value={newTask.date}
              onChange={(e) => setNewTask(prev => ({ ...prev, date: e.target.value }))}
              className="bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-600 text-white focus:border-amber-400"
            />
            <Input
              type="time"
              value={newTask.time}
              onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
              className="bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-600 text-white focus:border-amber-400"
            />
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title.trim() || !newTask.date || !newTask.time}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white text-sm"
            >
              Save
            </Button>
          </div>
          {(!newTask.title.trim() || !newTask.date || !newTask.time) && (
            <p className="text-xs text-gray-400 mt-2">Please fill in all fields to save the task</p>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No tasks scheduled</p>
            <p className="text-sm mt-1">Add a task to get started</p>
          </div>
        ) : (
          tasks.map(task => {
            const status = getTaskStatus(task);
            const isOverdue = status === 'overdue';
            
            return (
              <div
                key={task.id}
                className={`p-3 rounded-xl border ${
                  isOverdue
                    ? 'bg-red-900/20 border-red-400/30'
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                      {task.title}
                    </div>
                    <div className={`text-xs mt-1 ${isOverdue ? 'text-red-300' : 'text-gray-400'}`}>
                      {new Date(task.datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })} - {new Date(task.datetime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(status)}
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="icon"
                      className={`${isOverdue ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'} p-1`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
        <span className="text-green-400">Completed: {stats.completed}</span>
        <span className="text-amber-400">Pending: {stats.pending}</span>
        <span className="text-red-400">Overdue: {stats.overdue}</span>
      </div>
    </div>
  );
}
