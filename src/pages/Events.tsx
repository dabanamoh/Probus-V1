
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Gift, Users, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format, isToday, isBefore, isAfter, addDays } from 'date-fns';

const Events = () => {
  const [activeTab, setActiveTab] = useState('birthdays');

  // Fetch employees for birthdays and work anniversaries
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch holidays
  const { data: holidays = [], isLoading: holidaysLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('date');
      
      if (error) throw error;
      return data;
    },
  });

  // Process birthdays - get upcoming birthdays
  const getUpcomingBirthdays = () => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    
    return employees
      .filter(emp => emp.date_of_birth)
      .map(emp => {
        const birthDate = new Date(emp.date_of_birth);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        const nextYearBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        
        const upcomingBirthday = isBefore(thisYearBirthday, today) ? nextYearBirthday : thisYearBirthday;
        
        return {
          ...emp,
          upcomingBirthday,
          isToday: isToday(upcomingBirthday),
          daysUntil: Math.ceil((upcomingBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .filter(emp => emp.upcomingBirthday <= next30Days)
      .sort((a, b) => a.upcomingBirthday.getTime() - b.upcomingBirthday.getTime());
  };

  // Process work anniversaries
  const getUpcomingAnniversaries = () => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    
    return employees
      .filter(emp => emp.date_of_resumption)
      .map(emp => {
        const startDate = new Date(emp.date_of_resumption);
        const thisYearAnniversary = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());
        const nextYearAnniversary = new Date(today.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        
        const upcomingAnniversary = isBefore(thisYearAnniversary, today) ? nextYearAnniversary : thisYearAnniversary;
        const yearsOfService = today.getFullYear() - startDate.getFullYear();
        
        return {
          ...emp,
          upcomingAnniversary,
          yearsOfService,
          isToday: isToday(upcomingAnniversary),
          daysUntil: Math.ceil((upcomingAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .filter(emp => emp.upcomingAnniversary <= next30Days && emp.yearsOfService > 0)
      .sort((a, b) => a.upcomingAnniversary.getTime() - b.upcomingAnniversary.getTime());
  };

  // Process upcoming holidays
  const getUpcomingHolidays = () => {
    const today = new Date();
    const next90Days = addDays(today, 90);
    
    return holidays
      .map(holiday => {
        const holidayDate = new Date(holiday.date);
        const thisYearHoliday = new Date(today.getFullYear(), holidayDate.getMonth(), holidayDate.getDate());
        const nextYearHoliday = new Date(today.getFullYear() + 1, holidayDate.getMonth(), holidayDate.getDate());
        
        const upcomingHoliday = holiday.is_recurring && isBefore(thisYearHoliday, today) 
          ? nextYearHoliday 
          : thisYearHoliday;
        
        return {
          ...holiday,
          upcomingDate: upcomingHoliday,
          isToday: isToday(upcomingHoliday),
          daysUntil: Math.ceil((upcomingHoliday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .filter(holiday => holiday.upcomingDate <= next90Days)
      .sort((a, b) => a.upcomingDate.getTime() - b.upcomingDate.getTime());
  };

  const upcomingBirthdays = getUpcomingBirthdays();
  const upcomingAnniversaries = getUpcomingAnniversaries();
  const upcomingHolidays = getUpcomingHolidays();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Events & Celebrations</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-700">Upcoming Birthdays</p>
                    <p className="text-2xl font-bold text-pink-800">{upcomingBirthdays.length}</p>
                  </div>
                  <Gift className="w-8 h-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Work Anniversaries</p>
                    <p className="text-2xl font-bold text-purple-800">{upcomingAnniversaries.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Upcoming Holidays</p>
                    <p className="text-2xl font-bold text-green-800">{upcomingHolidays.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different event types */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
              <TabsTrigger value="anniversaries">Work Anniversaries</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
            </TabsList>

            <TabsContent value="birthdays" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Upcoming Birthdays (Next 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employeesLoading ? (
                    <p>Loading birthdays...</p>
                  ) : upcomingBirthdays.length === 0 ? (
                    <p className="text-gray-500">No upcoming birthdays in the next 30 days.</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBirthdays.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-pink-100 text-pink-700">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-800">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.position || 'Employee'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              {format(employee.upcomingBirthday, 'MMM dd, yyyy')}
                            </p>
                            <Badge variant={employee.isToday ? "default" : "outline"} className="mt-1">
                              {employee.isToday ? "Today!" : `${employee.daysUntil} days`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anniversaries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Upcoming Work Anniversaries (Next 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employeesLoading ? (
                    <p>Loading anniversaries...</p>
                  ) : upcomingAnniversaries.length === 0 ? (
                    <p className="text-gray-500">No upcoming work anniversaries in the next 30 days.</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAnniversaries.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-purple-100 text-purple-700">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-800">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.position || 'Employee'}</p>
                              <p className="text-sm text-purple-600 font-medium">
                                {employee.yearsOfService} year{employee.yearsOfService !== 1 ? 's' : ''} of service
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              {format(employee.upcomingAnniversary, 'MMM dd, yyyy')}
                            </p>
                            <Badge variant={employee.isToday ? "default" : "outline"} className="mt-1">
                              {employee.isToday ? "Today!" : `${employee.daysUntil} days`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holidays" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Holidays (Next 90 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {holidaysLoading ? (
                    <p>Loading holidays...</p>
                  ) : upcomingHolidays.length === 0 ? (
                    <p className="text-gray-500">No upcoming holidays in the next 90 days.</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingHolidays.map((holiday) => (
                        <div key={holiday.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{holiday.name}</p>
                              {holiday.description && (
                                <p className="text-sm text-gray-600">{holiday.description}</p>
                              )}
                              {holiday.is_recurring && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  Annual Holiday
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              {format(holiday.upcomingDate, 'MMM dd, yyyy')}
                            </p>
                            <Badge variant={holiday.isToday ? "default" : "outline"} className="mt-1">
                              {holiday.isToday ? "Today!" : `${holiday.daysUntil} days`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Events;
