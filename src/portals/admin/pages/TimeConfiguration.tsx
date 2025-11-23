import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Switch } from "../../shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Badge } from "../../shared/ui/badge";
import { 
  MapPin, 
  Clock, 
  Globe, 
  Building2,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  Users,
  Settings,
  Calendar
} from 'lucide-react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  isActive: boolean;
}

interface WorkSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  isDefault: boolean;
}

interface RemoteWorkPolicy {
  id: string;
  name: string;
  type: 'full_remote' | 'hybrid' | 'specific_days';
  allowedDays?: string[];
  requiresApproval: boolean;
  assignedTo: 'all' | 'department' | 'specific_users';
  departmentIds?: string[];
  userIds?: string[];
}

const TimeConfiguration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('locations');

  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([
    {
      id: '1',
      name: 'Headquarters',
      address: '123 Main Street, New York, NY 10001',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
      isActive: true
    },
    {
      id: '2',
      name: 'Branch Office - Chicago',
      address: '456 Oak Avenue, Chicago, IL 60601',
      latitude: 41.8781,
      longitude: -87.6298,
      radius: 50,
      isActive: true
    }
  ]);

  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([
    {
      id: '1',
      name: 'Standard Office Hours',
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isDefault: true
    },
    {
      id: '2',
      name: 'Flexible Hours',
      startTime: '08:00',
      endTime: '18:00',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      isDefault: false
    }
  ]);

  const [remoteWorkPolicies, setRemoteWorkPolicies] = useState<RemoteWorkPolicy[]>([
    {
      id: '1',
      name: 'Full Remote Team',
      type: 'full_remote',
      requiresApproval: false,
      assignedTo: 'department',
      departmentIds: ['dept-engineering']
    },
    {
      id: '2',
      name: 'Hybrid Schedule',
      type: 'hybrid',
      requiresApproval: true,
      assignedTo: 'all'
    },
    {
      id: '3',
      name: 'Friday Remote',
      type: 'specific_days',
      allowedDays: ['Friday'],
      requiresApproval: false,
      assignedTo: 'department',
      departmentIds: ['dept-sales']
    }
  ]);

  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius: '100'
  });

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [] as string[]
  });

  const [settings, setSettings] = useState({
    requireLocationForClockIn: true,
    requireLocationForClockOut: true,
    allowManualTimeEntry: false,
    autoClockOutAfterHours: 12,
    lateThresholdMinutes: 15,
    enableBreakTracking: true,
    maxBreakDuration: 60,
    requirePhotoVerification: false,
    enableGeofencing: true
  });

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.latitude || !newLocation.longitude) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const location: OfficeLocation = {
      id: Date.now().toString(),
      name: newLocation.name,
      address: newLocation.address,
      latitude: parseFloat(newLocation.latitude),
      longitude: parseFloat(newLocation.longitude),
      radius: parseInt(newLocation.radius),
      isActive: true
    };

    setOfficeLocations([...officeLocations, location]);
    setNewLocation({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      radius: '100'
    });

    toast({
      title: "Success",
      description: "Office location added successfully"
    });
  };

  const handleDeleteLocation = (id: string) => {
    setOfficeLocations(officeLocations.filter(loc => loc.id !== id));
    toast({
      title: "Success",
      description: "Office location removed"
    });
  };

  const handleToggleLocation = (id: string) => {
    setOfficeLocations(officeLocations.map(loc => 
      loc.id === id ? { ...loc, isActive: !loc.isActive } : loc
    ));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Success",
      description: "Time tracking settings saved successfully"
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">
            Time Tracking Configuration
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Configure office locations, work schedules, and remote work policies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="dark:bg-slate-800 dark:border-slate-700">
            <TabsTrigger value="locations" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">
              <MapPin className="w-4 h-4 mr-2" />
              Office Locations
            </TabsTrigger>
            <TabsTrigger value="schedules" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">
              <Clock className="w-4 h-4 mr-2" />
              Work Schedules
            </TabsTrigger>
            <TabsTrigger value="remote" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">
              <Globe className="w-4 h-4 mr-2" />
              Remote Work
            </TabsTrigger>
            <TabsTrigger value="settings" className="dark:data-[state=active]:bg-slate-700 dark:text-slate-300 dark:data-[state=active]:text-slate-100">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Office Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Add Office Location</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Define office locations for geofenced clock in/out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="location-name" className="dark:text-slate-200">Location Name *</Label>
                    <Input
                      id="location-name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      placeholder="e.g., Headquarters"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location-address" className="dark:text-slate-200">Address</Label>
                    <Input
                      id="location-address"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      placeholder="Full address"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="latitude" className="dark:text-slate-200">Latitude *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={newLocation.latitude}
                      onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
                      placeholder="40.7128"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="dark:text-slate-200">Longitude *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={newLocation.longitude}
                      onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
                      placeholder="-74.0060"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="radius" className="dark:text-slate-200">Geofence Radius (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={newLocation.radius}
                      onChange={(e) => setNewLocation({ ...newLocation, radius: e.target.value })}
                      placeholder="100"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                  </div>
                </div>
                <Button onClick={handleAddLocation} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Office Locations</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  {officeLocations.length} location(s) configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {officeLocations.map((location) => (
                    <div
                      key={location.id}
                      className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow dark:bg-slate-700/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-slate-100">{location.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-slate-400">{location.address}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-slate-400 ml-14">
                            <div>
                              <span className="font-medium">Coordinates:</span> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                            </div>
                            <div>
                              <span className="font-medium">Radius:</span> {location.radius}m
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={location.isActive}
                            onCheckedChange={() => handleToggleLocation(location.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLocation(location.id)}
                            className="dark:border-slate-600 dark:text-red-400 dark:hover:bg-slate-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Work Schedules</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Define standard work hours and resumption times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                                {schedule.name}
                                {schedule.isDefault && (
                                  <Badge className="ml-2 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                                    Default
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-slate-400">
                                {schedule.startTime} - {schedule.endTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-14">
                            {schedule.daysOfWeek.map((day) => (
                              <Badge key={day} variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remote Work Tab */}
          <TabsContent value="remote" className="space-y-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Remote Work Policies</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Configure who can work remotely and under what conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {remoteWorkPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow dark:bg-slate-700/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100">{policy.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-400 capitalize">
                              {policy.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          className={
                            policy.requiresApproval 
                              ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                          }
                        >
                          {policy.requiresApproval ? 'Requires Approval' : 'Auto-Approved'}
                        </Badge>
                      </div>
                      <div className="ml-14">
                        <div className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                          <span className="font-medium">Assigned to:</span> {policy.assignedTo === 'all' ? 'All employees' : policy.assignedTo}
                        </div>
                        {policy.allowedDays && policy.allowedDays.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {policy.allowedDays.map((day) => (
                              <Badge key={day} variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">
                  <AlertCircle className="w-5 h-5 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Remote Work Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-slate-300 mb-4">
                  The system automatically detects remote work by comparing employee clock-in location with configured office locations. When employees clock in outside the geofence radius, it's marked as remote work.
                </p>
                <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">How it works:</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Employee clocks in with location services enabled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>System checks if location is within any office geofence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>If outside all office locations, checks remote work policy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Approved remote work is logged, unapproved triggers notification</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-slate-100">Time Tracking Settings</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Configure global time tracking behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">Require Location for Clock In</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Employees must enable location services to clock in
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireLocationForClockIn}
                      onCheckedChange={(checked) => setSettings({ ...settings, requireLocationForClockIn: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">Require Location for Clock Out</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Employees must enable location services to clock out
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireLocationForClockOut}
                      onCheckedChange={(checked) => setSettings({ ...settings, requireLocationForClockOut: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">Enable Geofencing</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Verify employee location is within office boundaries
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableGeofencing}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableGeofencing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">Allow Manual Time Entry</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Employees can manually enter time if location services fail
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowManualTimeEntry}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowManualTimeEntry: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">Enable Break Tracking</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Allow employees to log break periods during work
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBreakTracking}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableBreakTracking: checked })}
                    />
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <Label htmlFor="late-threshold" className="dark:text-slate-200">Late Arrival Threshold (minutes)</Label>
                    <Input
                      id="late-threshold"
                      type="number"
                      value={settings.lateThresholdMinutes}
                      onChange={(e) => setSettings({ ...settings, lateThresholdMinutes: parseInt(e.target.value) })}
                      className="mt-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                      Mark employee as late if they clock in after this many minutes past schedule
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg dark:bg-slate-700/30">
                    <Label htmlFor="auto-clockout" className="dark:text-slate-200">Auto Clock-Out After (hours)</Label>
                    <Input
                      id="auto-clockout"
                      type="number"
                      value={settings.autoClockOutAfterHours}
                      onChange={(e) => setSettings({ ...settings, autoClockOutAfterHours: parseInt(e.target.value) })}
                      className="mt-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    />
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                      Automatically clock out employees after this duration to prevent forgotten sessions
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TimeConfiguration;
