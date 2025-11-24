import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { CheckCircle, Calendar, TrendingUp } from 'lucide-react';

interface ActivityRecord {
  id: string;
  date: string;
  type: 'chat_message' | 'task_completed' | 'meeting_attended' | 'absent' | 'late';
  count: number;
  details?: string;
}

interface ActivityAnalyticsProps {
  activityRecords: ActivityRecord[];
}

const ActivityAnalytics: React.FC<ActivityAnalyticsProps> = ({ activityRecords }) => {
  // Calculate summary statistics
  const tasksCompleted = activityRecords
    .filter(record => record.type === 'task_completed')
    .reduce((sum, record) => sum + record.count, 0);
    
  const meetingsAttended = activityRecords
    .filter(record => record.type === 'meeting_attended')
    .reduce((sum, record) => sum + record.count, 0);
    
  const daysAbsent = activityRecords
    .filter(record => record.type === 'absent')
    .reduce((sum, record) => sum + record.count, 0);
    
  const lateArrivals = activityRecords
    .filter(record => record.type === 'late')
    .reduce((sum, record) => sum + record.count, 0);

  return (
    <Card className="shadow-xl border-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
      <CardHeader className="pb-4 relative">
        <CardTitle className="text-xl font-bold text-gray-900">Activity Overview</CardTitle>
        <p className="text-gray-600 text-sm mt-1">Your recent work summary</p>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        {/* Key Metrics in Horizontal Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Task Completion - Vibrant Green */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="p-2 bg-white/25 backdrop-blur-sm rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">Tasks</h3>
            </div>
            <div className="space-y-3 relative">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-green-100 font-medium">This Week</span>
                <span className="text-2xl font-bold text-white drop-shadow-lg">{tasksCompleted}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-green-100 font-medium">Today</span>
                <span className="text-2xl font-bold text-white drop-shadow-lg">{Math.floor(tasksCompleted / 5)}</span>
              </div>
            </div>
          </div>

          {/* Meetings - Vibrant Purple */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="p-2 bg-white/25 backdrop-blur-sm rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">Meetings</h3>
            </div>
            <div className="space-y-3 relative">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-purple-100 font-medium">Attended</span>
                <span className="text-2xl font-bold text-white drop-shadow-lg">{meetingsAttended}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-purple-100 font-medium">Avg/Week</span>
                <span className="text-2xl font-bold text-white drop-shadow-lg">{Math.ceil(meetingsAttended / 4)}</span>
              </div>
            </div>
          </div>

          {/* Attendance - Vibrant Orange */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 rounded-xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="p-2 bg-white/25 backdrop-blur-sm rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white">Attendance</h3>
            </div>
            <div className="space-y-3 relative">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-orange-100 font-medium">Absent</span>
                <span className="text-2xl font-bold text-white drop-shadow-lg">{daysAbsent}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-orange-100 font-medium">Late</span>
                <span className="text-2xl font-bold text-white drop-shadow-lg">{lateArrivals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity List - Enhanced */}
        <div className="pt-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {activityRecords.slice(0, 8).map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-indigo-50 hover:to-purple-50 hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 capitalize">
                      {record.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-600 font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {record.details && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500 truncate">{record.details}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-sm font-bold text-white shadow-lg">
                    {record.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityAnalytics;
