import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  UserPlus,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface Activity {
  id: string;
  type: 'user_created' | 'user_updated' | 'user_deleted' | 'leave_requested' | 'leave_approved' | 'leave_rejected' | 'task_created' | 'task_completed' | 'message_sent' | 'notice_posted';
  actor: string;
  action: string;
  target?: string;
  timestamp: string;
  metadata?: any;
}

interface ActivityFeedProps {
  maxItems?: number;
  showTitle?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  maxItems = 10,
  showTitle = true
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Load activities from localStorage
    const storedActivities = localStorage.getItem(`activities_${user?.role}`);
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      // Initialize with default activities
      const defaultActivities = getDefaultActivities(user?.role || 'employee');
      setActivities(defaultActivities);
      if (user?.role) {
        localStorage.setItem(`activities_${user.role}`, JSON.stringify(defaultActivities));
      }
    }
  }, [user]);

  const getDefaultActivities = (role: string): Activity[] => {
    const baseActivities: Activity[] = [
      {
        id: '1',
        type: 'message_sent',
        actor: 'You',
        action: 'sent a message to',
        target: 'HR Team',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'leave_requested',
        actor: 'You',
        action: 'requested',
        target: 'Annual Leave (3 days)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    if (role === 'admin') {
      baseActivities.push(
        {
          id: '3',
          type: 'user_created',
          actor: 'Admin',
          action: 'approved registration for',
          target: 'Alice Johnson',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          type: 'notice_posted',
          actor: 'Admin',
          action: 'posted a notice',
          target: 'Company Holiday Announcement',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      );
    }

    if (role === 'manager') {
      baseActivities.push(
        {
          id: '5',
          type: 'leave_approved',
          actor: 'You',
          action: 'approved leave request for',
          target: 'Bob Williams',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '6',
          type: 'task_created',
          actor: 'You',
          action: 'assigned a task to',
          target: 'Carol Davis',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      );
    }

    return baseActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_created':
        return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'user_updated':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'user_deleted':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'leave_requested':
        return <Calendar className="w-4 h-4 text-yellow-600" />;
      case 'leave_approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'leave_rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'task_created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'message_sent':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'notice_posted':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? '' : 'p-0'}>
        <ScrollArea className="h-96">
          {displayedActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.actor}</span>
                      {' '}{activity.action}{' '}
                      {activity.target && (
                        <span className="font-medium">{activity.target}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;

// Helper function to add an activity programmatically
export const addActivity = (role: string, activity: Omit<Activity, 'id' | 'timestamp'>) => {
  const storedActivities = localStorage.getItem(`activities_${role}`);
  const activities: Activity[] = storedActivities ? JSON.parse(storedActivities) : [];
  
  const newActivity: Activity = {
    ...activity,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  
  activities.unshift(newActivity);
  // Keep only last 50 activities
  if (activities.length > 50) {
    activities.pop();
  }
  
  localStorage.setItem(`activities_${role}`, JSON.stringify(activities));
};
