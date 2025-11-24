import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
  Trash2
} from 'lucide-react';
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'registration' | 'leave' | 'task' | 'approval' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon?: React.ReactNode;
}

const NotificationCenter = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem(`notifications_${user?.email}`);
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Initialize with default notifications based on role
      const defaultNotifications = getDefaultNotifications(user?.role || 'employee');
      setNotifications(defaultNotifications);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const getDefaultNotifications = (role: string): Notification[] => {
    const baseNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        category: 'system',
        title: 'Welcome to Probus!',
        message: 'Your account has been activated. Complete your profile to get started.',
        timestamp: new Date().toISOString(),
        read: false,
        icon: <CheckCircle className="w-4 h-4" />
      }
    ];

    if (role === 'admin') {
      baseNotifications.push(
        {
          id: '2',
          type: 'info',
          category: 'registration',
          title: 'New Employee Registrations',
          message: '3 new employees are awaiting approval',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/pending-employees',
          icon: <UserPlus className="w-4 h-4" />
        }
      );
    }

    if (role === 'manager' || role === 'hr') {
      baseNotifications.push(
        {
          id: '3',
          type: 'warning',
          category: 'approval',
          title: 'Pending Approvals',
          message: 'You have 5 leave requests awaiting approval',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: role === 'manager' ? '/manager' : '/hr',
          icon: <Clock className="w-4 h-4" />
        }
      );
    }

    return baseNotifications;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
    if (notification.icon) return notification.icon;

    switch (notification.category) {
      case 'registration':
        return <UserPlus className="w-4 h-4" />;
      case 'leave':
        return <Calendar className="w-4 h-4" />;
      case 'task':
        return <CheckCircle className="w-4 h-4" />;
      case 'approval':
        return <FileText className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-8"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAll}
                    className="h-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <ScrollArea className="h-96">
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications</p>
                  <p className="text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          getNotificationColor(notification.type)
                        }`}>
                          {getNotificationIcon(notification)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 mt-2 text-blue-600"
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                                // Navigate to action URL
                                window.location.href = notification.actionUrl;
                              }}
                            >
                              View Details →
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

// Helper function to add a notification programmatically
export const addNotification = (userEmail: string, notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const storedNotifications = localStorage.getItem(`notifications_${userEmail}`);
  const notifications: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
  
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem(`notifications_${userEmail}`, JSON.stringify(notifications));
};
