import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button, buttonVariants } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Textarea } from "../../shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../shared/ui/dialog";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle,
  AlertCircle,
  Eye,
  Users,
  UserPlus,
  X
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
}

interface TaskAssignment {
  employeeId: string;
  employeeName: string;
  role: 'owner' | 'assignee' | 'participant';
  assignedAt: string;
}

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
  assignments: TaskAssignment[];
  taskType: 'personal' | 'assigned' | 'group';
}

const TaskManager = () => {
  // Mock employee directory data
  const [employees] = useState<Employee[]>([
    { id: 'emp-1', name: 'John Smith', department: 'Engineering', role: 'Senior Developer' },
    { id: 'emp-2', name: 'Sarah Johnson', department: 'Engineering', role: 'Product Manager' },
    { id: 'emp-3', name: 'Michael Chen', department: 'Design', role: 'UI/UX Designer' },
    { id: 'emp-4', name: 'Emily Davis', department: 'Engineering', role: 'QA Engineer' },
    { id: 'emp-5', name: 'David Wilson', department: 'Marketing', role: 'Marketing Manager' },
    { id: 'emp-6', name: 'Lisa Anderson', department: 'HR', role: 'HR Specialist' },
    { id: 'emp-7', name: 'James Brown', department: 'Finance', role: 'Financial Analyst' },
    { id: 'emp-8', name: 'Maria Garcia', department: 'Engineering', role: 'DevOps Engineer' },
  ]);

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
      timeSpent: 120,
      taskType: 'group',
      assignments: [
        { employeeId: 'current-user', employeeName: 'You', role: 'owner', assignedAt: '2025-09-20' },
        { employeeId: 'emp-2', employeeName: 'Sarah Johnson', role: 'participant', assignedAt: '2025-09-20' },
        { employeeId: 'emp-3', employeeName: 'Michael Chen', role: 'participant', assignedAt: '2025-09-20' }
      ]
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
      timeSpent: 0,
      taskType: 'personal',
      assignments: [
        { employeeId: 'current-user', employeeName: 'You', role: 'owner', assignedAt: '2025-09-19' }
      ]
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
      timeSpent: 90,
      taskType: 'assigned',
      assignments: [
        { employeeId: 'emp-2', employeeName: 'Sarah Johnson', role: 'owner', assignedAt: '2025-09-15' },
        { employeeId: 'current-user', employeeName: 'You', role: 'assignee', assignedAt: '2025-09-15' }
      ]
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [managingAssignments, setManagingAssignments] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    taskType: 'personal' as 'personal' | 'assigned' | 'group',
    assignments: [] as TaskAssignment[]
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
      timeSpent: 0,
      taskType: newTask.taskType,
      assignments: newTask.taskType === 'personal' 
        ? [{ employeeId: 'current-user', employeeName: 'You', role: 'owner', assignedAt: new Date().toISOString() }]
        : newTask.assignments
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', taskType: 'personal', assignments: [] });
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

  const addAssignment = (taskId: string, employee: Employee, role: 'assignee' | 'participant') => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newAssignment: TaskAssignment = {
          employeeId: employee.id,
          employeeName: employee.name,
          role: role,
          assignedAt: new Date().toISOString()
        };
        return {
          ...task,
          assignments: [...task.assignments, newAssignment],
          taskType: role === 'participant' || task.assignments.length > 1 ? 'group' : 'assigned',
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const removeAssignment = (taskId: string, employeeId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedAssignments = task.assignments.filter(a => a.employeeId !== employeeId);
        return {
          ...task,
          assignments: updatedAssignments,
          taskType: updatedAssignments.length <= 1 ? 'personal' : (updatedAssignments.some(a => a.role === 'participant') ? 'group' : 'assigned'),
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const addAssignmentToNewTask = (employee: Employee, role: 'assignee' | 'participant') => {
    const newAssignment: TaskAssignment = {
      employeeId: employee.id,
      employeeName: employee.name,
      role: role,
      assignedAt: new Date().toISOString()
    };
    setNewTask({
      ...newTask,
      assignments: [...newTask.assignments, newAssignment],
      taskType: role === 'participant' || newTask.assignments.length > 0 ? 'group' : 'assigned'
    });
  };

  const removeAssignmentFromNewTask = (employeeId: string) => {
    const updatedAssignments = newTask.assignments.filter(a => a.employeeId !== employeeId);
    setNewTask({
      ...newTask,
      assignments: updatedAssignments,
      taskType: updatedAssignments.length === 0 ? 'personal' : (updatedAssignments.some(a => a.role === 'participant') ? 'group' : 'assigned')
    });
  };

  const getTaskTypeLabel = (taskType: string) => {
    switch (taskType) {
      case 'personal': return 'Personal';
      case 'assigned': return 'Assigned';
      case 'group': return 'Group Project';
      default: return 'Personal';
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'personal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'group': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

              {/* Task Type Selection */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Task Type</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newTask.taskType === 'personal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewTask({ ...newTask, taskType: 'personal', assignments: [] })}
                    className="text-xs"
                  >
                    Personal
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.taskType === 'assigned' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewTask({ ...newTask, taskType: 'assigned', assignments: [] })}
                    className="text-xs"
                  >
                    Assign to Colleague
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.taskType === 'group' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewTask({ ...newTask, taskType: 'group', assignments: [] })}
                    className="text-xs"
                  >
                    Group Project
                  </Button>
                </div>
              </div>

              {/* Assignment Section */}
              {(newTask.taskType === 'assigned' || newTask.taskType === 'group') && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                    {newTask.taskType === 'assigned' ? 'Assign To' : 'Team Members'}
                  </label>
                  
                  {/* Current Assignments */}
                  {newTask.assignments.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {newTask.assignments.map(assignment => (
                        <div key={assignment.employeeId} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium">{assignment.employeeName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 capitalize">{assignment.role}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAssignmentFromNewTask(assignment.employeeId)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Assignment */}
                  <Select onValueChange={(value) => {
                    const employee = employees.find(e => e.id === value);
                    if (employee) {
                      addAssignmentToNewTask(employee, newTask.taskType === 'assigned' ? 'assignee' : 'participant');
                    }
                  }}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select colleague" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter(emp => !newTask.assignments.some(a => a.employeeId === emp.id))
                        .map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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

      {viewingTask && (
        <Dialog open={!!viewingTask} onOpenChange={() => setViewingTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(viewingTask.status)}
                {viewingTask.title}
              </DialogTitle>
              <DialogDescription>
                Task Details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Task Type and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getTaskTypeColor(viewingTask.taskType)}`}>
                      {getTaskTypeLabel(viewingTask.taskType)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${getPriorityColor(viewingTask.priority)}`}>
                      {viewingTask.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(viewingTask.status)}
                  <span className="text-sm font-medium capitalize">
                    {viewingTask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Team Members */}
              {viewingTask.assignments && viewingTask.assignments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    {viewingTask.assignments.map(assignment => (
                      <div key={assignment.employeeId} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm font-medium">{assignment.employeeName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assignment.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                          assignment.role === 'assignee' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assignment.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {viewingTask.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Dates and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {viewingTask.dueDate ? new Date(viewingTask.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Spent</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {viewingTask.timeSpent > 0 
                        ? `${Math.floor(viewingTask.timeSpent / 60)}h ${viewingTask.timeSpent % 60}m` 
                        : 'No time logged'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {new Date(viewingTask.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {new Date(viewingTask.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {viewingTask.status !== 'completed' && (
                  <>
                    <Button 
                      onClick={() => {
                        setManagingAssignments(viewingTask);
                        setViewingTask(null);
                      }}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Team
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditingTask(viewingTask);
                        setViewingTask(null);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Task
                    </Button>
                  </>
                )}
                {viewingTask.status !== 'completed' && (
                  <Button 
                    onClick={() => {
                      handleCompleteTask(viewingTask.id);
                      setViewingTask(null);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this task?')) {
                      handleDeleteTask(viewingTask.id);
                      setViewingTask(null);
                    }
                  }}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Manage Assignments Dialog */}
      {managingAssignments && (
        <Dialog open={!!managingAssignments} onOpenChange={() => setManagingAssignments(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manage Team - {managingAssignments.title}
              </DialogTitle>
              <DialogDescription>
                Add or remove team members for this task
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Current Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Team ({managingAssignments.assignments.length})</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {managingAssignments.assignments.map(assignment => (
                    <div key={assignment.employeeId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{assignment.employeeName}</p>
                        <p className="text-xs text-gray-500">Added {new Date(assignment.assignedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assignment.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                          assignment.role === 'assignee' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assignment.role}
                        </span>
                        {assignment.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAssignment(managingAssignments.id, assignment.employeeId)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Team Member */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Team Member</label>
                <div className="space-y-2">
                  {/* Select Employee */}
                  <Select onValueChange={(value) => {
                    const [employeeId, role] = value.split('|');
                    const employee = employees.find(e => e.id === employeeId);
                    if (employee) {
                      addAssignment(managingAssignments.id, employee, role as 'assignee' | 'participant');
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select colleague to add" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2 text-xs font-medium text-gray-500 border-b">Assign Task</div>
                      {employees
                        .filter(emp => !managingAssignments.assignments.some(a => a.employeeId === emp.id))
                        .map(employee => (
                          <SelectItem key={`${employee.id}|assignee`} value={`${employee.id}|assignee`}>
                            <div className="flex items-center justify-between w-full">
                              <span>{employee.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{employee.department}</span>
                            </div>
                          </SelectItem>
                        ))}
                      <div className="p-2 text-xs font-medium text-gray-500 border-b border-t mt-1">Add as Participant</div>
                      {employees
                        .filter(emp => !managingAssignments.assignments.some(a => a.employeeId === emp.id))
                        .map(employee => (
                          <SelectItem key={`${employee.id}|participant`} value={`${employee.id}|participant`}>
                            <div className="flex items-center justify-between w-full">
                              <span>{employee.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{employee.department}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Assignee:</strong> Person responsible for completing the task</p>
                    <p><strong>Participant:</strong> Team member contributing to a group project</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setManagingAssignments(null)} className="bg-blue-500 hover:bg-blue-600">
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                    
                    {/* Task Type and Team Info */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getTaskTypeColor(task.taskType)}`}>
                        {getTaskTypeLabel(task.taskType)}
                      </span>
                      {task.assignments.length > 1 && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {task.assignments.length} members
                        </div>
                      )}
                    </div>

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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setViewingTask(task)}
                          className="text-xs"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingTask(task)}
                            className="text-xs"
                            title="Edit Task"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setManagingAssignments(task)}
                            className="text-xs"
                            title="Manage Team"
                          >
                            <UserPlus className="w-3 h-3" />
                          </Button>
                        )}
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleCompleteTask(task.id)}
                            className="text-xs"
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-xs"
                          title="Delete Task"
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
