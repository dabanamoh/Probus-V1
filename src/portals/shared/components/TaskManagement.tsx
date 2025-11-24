import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Badge } from "../../shared/ui/badge";
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "../../shared/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdByName: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
}

const TaskManagement = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Q4 Report',
      description: 'Prepare and submit the quarterly financial report',
      assignedTo: 'emp001',
      assignedToName: 'John Doe',
      createdBy: 'emp002',
      createdByName: 'Jane Smith',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-12-01',
      createdAt: '2025-11-15'
    },
    {
      id: '2',
      title: 'Review Safety Procedures',
      description: 'Review and update company safety procedures',
      assignedTo: 'emp003',
      assignedToName: 'Mike Johnson',
      createdBy: 'emp002',
      createdByName: 'Jane Smith',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-11-30',
      createdAt: '2025-11-18'
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    assignedToName: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedToName: newTask.assignedToName || 'Unknown User',
      createdBy: 'current-user',
      createdByName: 'Current User',
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString()
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      assignedToName: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowCreateDialog(false);

    toast({
      title: "Task Created",
      description: `Task assigned to ${task.assignedToName}`
    });
  };

  const handleStatusChange = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    toast({
      title: "Status Updated",
      description: `Task status changed to ${newStatus.replace('_', ' ')}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> In Progress</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Task Management</h2>
          <p className="text-gray-600 text-sm">Create and manage tasks for your team</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignTo">Assign To *</Label>
                  <Input
                    id="assignTo"
                    value={newTask.assignedToName}
                    onChange={(e) => setNewTask({
                      ...newTask, 
                      assignedTo: `emp-${Date.now()}`,
                      assignedToName: e.target.value
                    })}
                    placeholder="Employee name"
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} className="bg-blue-500 hover:bg-blue-600">
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('in_progress')}
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="border-blue-200">
            <CardContent className="p-8 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="border-blue-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">{task.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Assigned to: <strong>{task.assignedToName}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Due: <strong>{new Date(task.dueDate).toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
