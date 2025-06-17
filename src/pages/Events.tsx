import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Users, Plus, Bell } from 'lucide-react';
import { format, isToday, isBefore, isAfter, addDays, startOfYear, endOfYear, addMonths, startOfMonth } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import EventsTable from '@/components/events/EventsTable';
import EventCalendar from '@/components/events/EventCalendar';

const Events = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

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

  // Process birthdays for the entire year
  const getAllYearBirthdays = () => {
    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    
    return employees
      .filter(emp => emp.date_of_birth)
      .map(emp => {
        const birthDate = new Date(emp.date_of_birth);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        const nextYearBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        
        const upcomingBirthday = isBefore(thisYearBirthday, today) ? nextYearBirthday : thisYearBirthday;
        
        return {
          id: emp.id,
          name: emp.name,
          position: emp.position,
          date: upcomingBirthday,
          type: 'birthday' as const,
          daysUntil: Math.ceil((upcomingBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Process work anniversaries for the entire year
  const getAllYearAnniversaries = () => {
    const today = new Date();
    
    return employees
      .filter(emp => emp.date_of_resumption)
      .map(emp => {
        const startDate = new Date(emp.date_of_resumption);
        const thisYearAnniversary = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());
        const nextYearAnniversary = new Date(today.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        
        const upcomingAnniversary = isBefore(thisYearAnniversary, today) ? nextYearAnniversary : thisYearAnniversary;
        const yearsOfService = today.getFullYear() - startDate.getFullYear();
        
        return {
          id: emp.id,
          name: emp.name,
          position: emp.position,
          date: upcomingAnniversary,
          type: 'anniversary' as const,
          yearsOfService,
          daysUntil: Math.ceil((upcomingAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .filter(emp => emp.yearsOfService > 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Process holidays for the entire year
  const getAllYearHolidays = () => {
    const today = new Date();
    
    return holidays
      .map(holiday => {
        const holidayDate = new Date(holiday.date);
        const thisYearHoliday = new Date(today.getFullYear(), holidayDate.getMonth(), holidayDate.getDate());
        const nextYearHoliday = new Date(today.getFullYear() + 1, holidayDate.getMonth(), holidayDate.getDate());
        
        const upcomingHoliday = holiday.is_recurring && isBefore(thisYearHoliday, today) 
          ? nextYearHoliday 
          : thisYearHoliday;
        
        return {
          id: holiday.id,
          name: holiday.name,
          date: upcomingHoliday,
          type: 'holiday' as const,
          description: holiday.description,
          daysUntil: Math.ceil((upcomingHoliday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Get upcoming events for summary
  const getUpcomingEvents = (days: number) => {
    const today = new Date();
    const futureDate = addDays(today, days);
    
    const allEvents = [
      ...getAllYearBirthdays(),
      ...getAllYearAnniversaries(),
      ...getAllYearHolidays()
    ];
    
    return allEvents.filter(event => event.date <= futureDate);
  };

  // Generate months for calendar view
  const generateMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      months.push(addMonths(startOfMonth(today), i));
    }
    return months;
  };

  // Handle admin notification
  const handleNotifyAdmin = (event: any) => {
    toast({
      title: "Admin Notified",
      description: `Notification sent for ${event.name}'s ${event.type} on ${format(event.date, 'MMM dd, yyyy')}`,
    });
    console.log('Notifying admin about:', event);
  };

  const upcomingEvents = getUpcomingEvents(30);
  const allBirthdays = getAllYearBirthdays();
  const allAnniversaries = getAllYearAnniversaries();
  const allHolidays = getAllYearHolidays();
  const months = generateMonths();

  // Convert events for calendar component
  const calendarEvents = [
    ...allBirthdays.map(b => ({ ...b, isPast: isBefore(b.date, new Date()) && !isToday(b.date) })),
    ...allAnniversaries.map(a => ({ ...a, isPast: isBefore(a.date, new Date()) && !isToday(a.date) })),
    ...allHolidays.map(h => ({ ...h, isPast: isBefore(h.date, new Date()) && !isToday(h.date) }))
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-700">Total Birthdays</p>
                    <p className="text-2xl font-bold text-pink-800">{allBirthdays.length}</p>
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
                    <p className="text-2xl font-bold text-purple-800">{allAnniversaries.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Holidays</p>
                    <p className="text-2xl font-bold text-green-800">{allHolidays.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Next 30 Days</p>
                    <p className="text-2xl font-bold text-blue-800">{upcomingEvents.length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
              <TabsTrigger value="anniversaries">Anniversaries</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>12-Month Calendar View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {months.map((month, index) => {
                        const monthEvents = calendarEvents.filter(event => 
                          event.date.getMonth() === month.getMonth() && 
                          event.date.getFullYear() === month.getFullYear()
                        );
                        return (
                          <EventCalendar
                            key={index}
                            month={month}
                            events={monthEvents}
                            onNotifyAdmin={handleNotifyAdmin}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="birthdays" className="mt-6">
              <EventsTable
                title="Employee Birthdays (Yearly View)"
                events={allBirthdays}
                type="birthday"
                onNotifyAdmin={handleNotifyAdmin}
              />
            </TabsContent>

            <TabsContent value="anniversaries" className="mt-6">
              <EventsTable
                title="Work Anniversaries (Yearly View)"
                events={allAnniversaries}
                type="anniversary"
                onNotifyAdmin={handleNotifyAdmin}
              />
            </TabsContent>

            <TabsContent value="holidays" className="mt-6">
              <EventsTable
                title="Company Holidays (Yearly View)"
                events={allHolidays}
                type="holiday"
                onNotifyAdmin={handleNotifyAdmin}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Events;
