import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button, buttonVariants } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Textarea } from "../../shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle,
  AlertCircle
} from 'lucide-react';
// TODO: Re-enable when taskService is available
// import { logTaskCreate, logTaskUpdate, logTaskComplete } from '@/employee-app/services/taskService';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  timeSpent: number; // in minutes
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the Q3 project proposal for the new client',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2025-09-25',
      createdAt: '2025-09-20',
      updatedAt: '2025-09-20',
      timeSpent: 120
    },
    {
      id: '2',
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for weekly team meeting',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-09-22',
      createdAt: '2025-09-19',
      updatedAt: '2025-09-19',
      timeSpent: 0
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Update user guides for the new features',
      status: 'completed',
      priority: 'low',
      dueDate: '2025-09-18',
      createdAt: '2025-09-15',
      updatedAt: '2025-09-18',
      timeSpent: 90
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      dueDate: newTask.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeSpent: 0
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsCreating(false);

    // Log task creation
    // TODO: Re-enable when taskService is available
    // await logTaskCreate(task.id, 'employee-123', {
    //   title: task.title,
    //   description: task.description,
    //   priority: task.priority,
    //   dueDate: task.dueDate
    // });
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
        : task
    ));

    setEditingTask(null);

    // Log task update
    // TODO: Re-enable when taskService is available
    // const task = tasks.find(t => t.id === id);
    // if (task) {
    //   await logTaskUpdate(task.id, 'employee-123', updates);
    // }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));

    // Log task deletion (as an update with status cancelled)
    // TODO: Re-enable when taskService is available
    // await logTaskUpdate(id, 'employee-123', { status: 'cancelled' });
  };

  const handleCompleteTask = async (id: string) => {
    handleUpdateTask(id, { status: 'completed' });

    // Log task completion
    // TODO: Re-enable when taskService is available
    // const task = tasks.find(t => t.id === id);
    // if (task) {
    //   await logTaskComplete(task.id, 'employee-123', {});
    // }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredTasks = (status: Task['status']) => 
    tasks.filter(task => task.status === status);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Task Management</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage your personal tasks and track progress</p>
      </div>

      <div className="mb-4 md:mb-6">
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-500 hover:bg-blue-600 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create New Task'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Task title"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Task description"
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="text-sm"
                  />
                </div>
              </div>
              <Button onClick={handleCreateTask} className="bg-blue-500 hover:bg-blue-600 text-sm">
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingTask && (
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select value={editingTask.status} onValueChange={(value: any) => setEditingTask({...editingTask, status: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <Select value={editingTask.priority} onValueChange={(value: any) => setEditingTask({...editingTask, priority: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Button onClick={() => handleUpdateTask(editingTask.id, editingTask)} className="bg-blue-500 hover:bg-blue-600 text-sm flex-1">
                  Save Changes
                </Button>
                <Button onClick={() => setEditingTask(null)} variant="outline" className="text-sm flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {(['todo', 'in_progress', 'completed'] as const).map(status => (
          <div key={status}>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 capitalize">
              {status.replace('_', ' ')} ({filteredTasks(status).length})
            </h2>
            <div className="space-y-3 md:space-y-4">
              {filteredTasks(status).map(task => (
                <Card key={task.id} className="border border-gray-200">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm md:text-base">{task.title}</h3>
                      {getStatusIcon(task.status)}
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">{task.description}</p>
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="text-xs text-gray-500">
                        {task.timeSpent > 0 && `${Math.floor(task.timeSpent / 60)}h ${task.timeSpent % 60}m spent`}
                      </div>
                      <div className="flex space-x-1 md:space-x-2">
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingTask(task)}
                            className="text-xs"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleCompleteTask(task.id)}
                            className="text-xs"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
