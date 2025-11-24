import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { 
  Clock, 
  MapPin, 
  Calendar,
  Play,
  Square,
  CheckCircle,
  AlertCircle,
  MapPinned,
  Globe,
  Building2,
  TrendingUp,
  Coffee,
  LogOut,
  LogIn
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";

interface TimeRecord {
  id: string;
  clockIn: Date;
  clockOut: Date | null;
  duration: number | null; // in minutes
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  workType: 'office' | 'remote' | 'hybrid';
  status: 'in_progress' | 'completed' | 'break';
}

const TimeTracking = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeRecord | null>(null);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([
    {
      id: '1',
      clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000),
      clockOut: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 360,
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 10,
        address: 'Office HQ, New York'
      },
      workType: 'office',
      status: 'completed'
    },
    {
      id: '2',
      clockIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      clockOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
      duration: 540,
      location: {
        latitude: 40.7580,
        longitude: -73.9855,
        accuracy: 15,
        address: 'Home - Remote Work'
      },
      workType: 'remote',
      status: 'completed'
    }
  ]);
  const [timer, setTimer] = useState(0);
  const [activeTab, setActiveTab] = useState('today');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);

  // Timer effect for active session
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isClockedIn && currentSession && !isOnBreak) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000); // Update every second for real-time display
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, currentSession, isOnBreak]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCurrentLocation = async (): Promise<{lat: number, lng: number, address?: string}> => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location' // In production, use reverse geocoding
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleClockIn = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      const now = new Date();
      const newSession: TimeRecord = {
        id: Date.now().toString(),
        clockIn: now,
        clockOut: null,
        duration: null,
        location: {
          latitude: location.lat,
          longitude: location.lng,
          accuracy: 10,
          address: location.address
        },
        workType: 'office', // Auto-detect based on location in production
        status: 'in_progress'
      };
      
      setCurrentSession(newSession);
      setIsClockedIn(true);
      setTimer(0);
      
      // TODO: Re-enable when auditService is available
      // await captureAndLogLocation('employee-123', 'clock_in');
    } catch (error) {
      console.error('Error during clock in:', error);
      alert('Unable to capture location. Please enable location services.');
    }
  };

  const handleClockOut = async () => {
    if (!currentSession) return;
    
    try {
      const location = await getCurrentLocation();
      const now = new Date();
      const duration = Math.floor((now.getTime() - currentSession.clockIn.getTime()) / 60000);
      
      const updatedSession = {
        ...currentSession,
        clockOut: now,
        duration: duration,
        status: 'completed' as const
      };
      
      setTimeRecords([updatedSession, ...timeRecords]);
      setCurrentSession(null);
      setIsClockedIn(false);
      setIsOnBreak(false);
      setTimer(0);
      setCurrentLocation(null);
      
      // TODO: Re-enable when auditService is available
      // await captureAndLogLocation('employee-123', 'clock_out');
    } catch (error) {
      console.error('Error during clock out:', error);
    }
  };

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
  };

  const getWorkTypeColor = (type: string) => {
    switch (type) {
      case 'office': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'remote': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'hybrid': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (record: TimeRecord) => {
    if (record.status === 'in_progress') return 'text-blue-600 dark:text-blue-400';
    if (record.duration === null) return 'text-blue-600 dark:text-blue-400';
    if (record.duration < 480) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const todayRecords = timeRecords.filter(r => 
    r.clockIn.toDateString() === new Date().toDateString()
  );

  const thisWeekRecords = timeRecords.filter(r => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return r.clockIn >= weekAgo;
  });

  const totalHoursToday = todayRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60;
  const totalHoursWeek = thisWeekRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60;

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">Time Tracking</h1>
        <p className="text-gray-600 dark:text-slate-400">Track your work hours with location verification</p>
      </div>

      {/* Active Session Card */}
      {isClockedIn && currentSession && (
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-500/30 shadow-lg dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Active Session</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Clocked in at {currentSession.clockIn.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Badge className={`${isOnBreak ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'} text-lg px-4 py-2`}>
                {isOnBreak ? 'On Break' : 'Working'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 p-4 rounded-xl">
                <div className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Time Elapsed</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {formatTime(timer)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 p-4 rounded-xl">
                <div className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Work Type</div>
                <Badge className={getWorkTypeColor(currentSession.workType)}>
                  {currentSession.workType === 'office' && <Building2 className="w-4 h-4 mr-1" />}
                  {currentSession.workType === 'remote' && <Globe className="w-4 h-4 mr-1" />}
                  {currentSession.workType.charAt(0).toUpperCase() + currentSession.workType.slice(1)}
                </Badge>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 p-4 rounded-xl">
                <div className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">Location</div>
                <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-slate-300">
                  <MapPinned className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="truncate">{currentSession.location?.address || 'Verified'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleClockOut}
                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 h-12 text-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Clock Out
              </Button>
              <Button 
                onClick={handleBreakToggle}
                variant="outline"
                className={`flex-1 h-12 text-lg ${
                  isOnBreak 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400' 
                    : 'dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Coffee className="w-5 h-5 mr-2" />
                {isOnBreak ? 'Resume Work' : 'Take Break'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clock In Button */}
      {!isClockedIn && (
        <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="inline-flex p-4 bg-green-100 dark:bg-green-500/10 rounded-full mb-4">
              <LogIn className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-2">Ready to Start?</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">Clock in to begin tracking your work hours</p>
            <Button 
              onClick={handleClockIn}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 h-14 text-lg px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Clock In Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Today's Hours</p>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {totalHoursToday.toFixed(1)}h
                </h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">This Week</p>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {totalHoursWeek.toFixed(1)}h
                </h3>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Today's Sessions</p>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {todayRecords.length}
                </h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Status</p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {isClockedIn ? (isOnBreak ? 'On Break' : 'Working') : 'Off Duty'}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                {isClockedIn ? (
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Square className="w-6 h-6 text-gray-600 dark:text-slate-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Records Tabs */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Time Records</CardTitle>
          <CardDescription className="dark:text-slate-400">View your attendance history and work sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="dark:bg-slate-700 dark:border-slate-600 mb-4">
              <TabsTrigger value="today" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-slate-100">Today</TabsTrigger>
              <TabsTrigger value="week" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-slate-100">This Week</TabsTrigger>
              <TabsTrigger value="all" className="dark:data-[state=active]:bg-slate-600 dark:text-slate-300 dark:data-[state=active]:text-slate-100">All Records</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {todayRecords.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  No records for today
                </div>
              ) : (
                todayRecords.map(record => (
                  <RecordCard key={record.id} record={record} getWorkTypeColor={getWorkTypeColor} getStatusColor={getStatusColor} formatDuration={formatDuration} />
                ))
              )}
            </TabsContent>

            <TabsContent value="week" className="space-y-4">
              {thisWeekRecords.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  No records this week
                </div>
              ) : (
                thisWeekRecords.map(record => (
                  <RecordCard key={record.id} record={record} getWorkTypeColor={getWorkTypeColor} getStatusColor={getStatusColor} formatDuration={formatDuration} />
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {timeRecords.map(record => (
                <RecordCard key={record.id} record={record} getWorkTypeColor={getWorkTypeColor} getStatusColor={getStatusColor} formatDuration={formatDuration} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const RecordCard = ({ record, getWorkTypeColor, getStatusColor, formatDuration }: {
  record: TimeRecord;
  getWorkTypeColor: (type: string) => string;
  getStatusColor: (record: TimeRecord) => string;
  formatDuration: (minutes: number) => string;
}) => (
  <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow dark:bg-slate-700/30">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="font-semibold text-gray-900 dark:text-slate-100">
            {record.clockIn.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <Badge className={getWorkTypeColor(record.workType)}>
            {record.workType === 'office' && <Building2 className="w-3 h-3 mr-1" />}
            {record.workType === 'remote' && <Globe className="w-3 h-3 mr-1" />}
            {record.workType.charAt(0).toUpperCase() + record.workType.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {record.clockIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {record.clockOut ? record.clockOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress'}
        </div>
        {record.location && (
          <div className="text-xs text-gray-500 dark:text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {record.location.address || `${record.location.latitude.toFixed(4)}, ${record.location.longitude.toFixed(4)}`}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className={`text-right`}>
          <div className={`text-2xl font-bold ${getStatusColor(record)}`}>
            {record.duration !== null ? formatDuration(record.duration) : 'Active'}
          </div>
          {record.status === 'completed' && record.duration && (
            <div className="text-xs text-gray-500 dark:text-slate-500">
              {record.duration >= 480 ? 'Full Day' : 'Partial'}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default TimeTracking;
