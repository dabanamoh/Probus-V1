import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../layouts/AdminSidebar';
import { Card, CardContent } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import {
  Bell,
  CheckCircle,
  X,
  UserPlus,
  FileText,
  Calendar,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Settings as SettingsIcon,
  TrendingUp,
  Users,
  ShieldAlert
} from 'lucide-react';
import { Input } from "../../shared/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'registration' | 'leave' | 'task' | 'approval' | 'message' | 'system' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

const Notifications = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Initialize with mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        category: 'registration',
        title: 'New Employee Registration',
        message: 'Sarah Johnson has submitted their registration form and is awaiting approval.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: '/pending-employees',
        priority: 'high'
      },
      {
        id: '2',
        type: 'warning',
        category: 'approval',
        title: 'Pending Leave Requests',
        message: 'You have 5 leave requests that require your attention.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: '/leave',
        priority: 'high'
      },
      {
        id: '3',
        type: 'success',
        category: 'task',
        title: 'Task Completed',
        message: 'The quarterly report has been successfully submitted by the finance team.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'info',
        category: 'message',
        title: 'New Message from HR Team',
        message: 'The HR team has sent you a message regarding the upcoming company event.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionUrl: '/messages',
        priority: 'low'
      },
      {
        id: '5',
        type: 'error',
        category: 'security',
        title: 'Security Alert',
        message: 'Unusual login attempt detected from a new device. Please verify your account.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'high'
      },
      {
        id: '6',
        type: 'info',
        category: 'leave',
        title: 'Leave Request Approved',
        message: 'Your leave request for December 20-25 has been approved by your manager.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'medium'
      },
      {
        id: '7',
        type: 'success',
        category: 'system',
        title: 'System Maintenance Complete',
        message: 'Scheduled system maintenance has been completed successfully. All services are now operational.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low'
      },
      {
        id: '8',
        type: 'warning',
        category: 'task',
        title: 'Upcoming Deadline',
        message: 'Your project proposal is due in 2 days. Please ensure all sections are completed.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'high'
      },
      {
        id: '9',
        type: 'info',
        category: 'registration',
        title: 'Employee Profile Updated',
        message: 'John Smith has updated their profile information.',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low'
      },
      {
        id: '10',
        type: 'info',
        category: 'approval',
        title: 'Document Approval Required',
        message: 'A new policy document is awaiting your approval.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionUrl: '/admin',
        priority: 'medium'
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.read) || 
      (filter === 'read' && notification.read);
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      notification.category === categoryFilter;
    
    const matchesSearch = 
      searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All Notifications Marked as Read",
      description: `${unreadCount} notifications marked as read`
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification removed successfully"
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "All Notifications Cleared",
      description: "All notifications have been removed"
    });
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.category) {
      case 'registration':
        return <UserPlus className="w-5 h-5" />;
      case 'leave':
        return <Calendar className="w-5 h-5" />;
      case 'task':
        return <CheckCircle className="w-5 h-5" />;
      case 'approval':
        return <FileText className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'security':
        return <ShieldAlert className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-orange-100 text-orange-700 border-orange-300',
      low: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900 w-full overflow-hidden max-w-full">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Notifications</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Stay updated with important alerts and updates</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{notifications.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{unreadCount}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{highPriorityCount}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="registration">Registration</option>
                  <option value="approval">Approval</option>
                  <option value="task">Task</option>
                  <option value="leave">Leave</option>
                  <option value="message">Message</option>
                  <option value="security">Security</option>
                  <option value="system">System</option>
                </select>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={markAllAsRead}
                      className="whitespace-nowrap"
                    >
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Mark all read
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={clearAll}
                      className="text-red-600 hover:text-red-700 whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear all
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-sm text-gray-500">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md border-l-4 ${
                    !notification.read ? 'bg-blue-50 border-l-blue-500' : 'border-l-transparent'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
                        getNotificationColor(notification.type)
                      }`}>
                        {getNotificationIcon(notification)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-base font-semibold ${
                                !notification.read ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                              )}
                              <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <span className="capitalize">{notification.category}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              markAsRead(notification.id);
                              navigate(notification.actionUrl!);
                            }}
                          >
                            View Details →
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
