import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localDb } from '@/integrations/local-db';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/ui/tabs";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../shared/ui/dialog";
import { Calendar, Gift, Users, Plus, Bell, ChevronLeft, ChevronRight, Cake, PartyPopper, Sparkles, AlarmClock, Trash2, Edit, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { format, isToday, isBefore, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isPast } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import EventsTable from '../../shared/components/events/EventsTable';
import EventCalendar from '@/components/events/EventCalendar';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: 'task' | 'meeting' | 'deadline' | 'personal' | 'other';
  completed: boolean;
  createdAt: string;
}

interface EventsProps {
  standalone?: boolean; // If true, wraps in DashboardLayout; if false, renders only content
}

const Events: React.FC<EventsProps> = ({ standalone = true }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();
  
  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Submit Q4 Report',
      description: 'Complete and submit quarterly performance report',
      date: '2024-12-15',
      time: '17:00',
      priority: 'high',
      category: 'deadline',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Weekly team sync meeting',
      date: '2024-11-25',
      time: '14:00',
      priority: 'medium',
      category: 'meeting',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Complete Phase 1 of the project',
      date: '2024-11-30',
      time: '23:59',
      priority: 'high',
      category: 'deadline',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]);
  
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    priority: 'medium',
    category: 'task'
  });

  // Fetch employees for birthdays and work anniversaries
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await localDb
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
      const { data, error } = await localDb
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

        const upcomingHoliday = isBefore(thisYearHoliday, today)
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
      const month = new Date(today.getFullYear(), i, 1);
      months.push(month);
    }
    return months;
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleNotifyAdmin = (event: any) => {
    toast({
      title: "Event Notification",
      description: `Reminder: ${event.name} - ${event.type}`,
    });
  };

  // Reminder functions
  const handleCreateReminder = () => {
    if (!newReminder.title || !newReminder.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and date",
        variant: "destructive"
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description || '',
      date: newReminder.date!,
      time: newReminder.time || '09:00',
      priority: newReminder.priority as 'low' | 'medium' | 'high',
      category: newReminder.category as 'task' | 'meeting' | 'deadline' | 'personal' | 'other',
      completed: false,
      createdAt: new Date().toISOString()
    };

    setReminders([...reminders, reminder]);
    setIsReminderDialogOpen(false);
    setNewReminder({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      priority: 'medium',
      category: 'task'
    });
    
    toast({
      title: "Reminder Created",
      description: `Reminder "${reminder.title}" has been added`,
    });
  };

  const handleUpdateReminder = () => {
    if (!editingReminder) return;
    
    setReminders(reminders.map(r => 
      r.id === editingReminder.id ? editingReminder : r
    ));
    setEditingReminder(null);
    
    toast({
      title: "Reminder Updated",
      description: "Your reminder has been updated",
    });
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "Reminder has been removed",
    });
  };

  const handleToggleComplete = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'medium': return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'meeting': return Users;
      case 'deadline': return AlarmClock;
      case 'task': return CheckCircle2;
      case 'personal': return Gift;
      default: return Bell;
    }
  };

  // Get upcoming reminders (next 7 days)
  const upcomingReminders = reminders
    .filter(r => !r.completed && new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Get overdue reminders
  const overdueReminders = reminders
    .filter(r => !r.completed && isPast(new Date(r.date)) && !isToday(new Date(r.date)))
    .length;

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const allEvents = [
      ...getAllYearBirthdays(),
      ...getAllYearAnniversaries(),
      ...getAllYearHolidays()
    ];

    return allEvents.filter(event => isSameDay(event.date, day));
  };

  // Get event color based on type (Probus styling)
  const getEventColor = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'anniversary':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const upcomingEvents = getUpcomingEvents(30);
  const allBirthdays = getAllYearBirthdays();
  const allAnniversaries = getAllYearAnniversaries();
  const allHolidays = getAllYearHolidays();
  const months = generateMonths();
  const calendarDays = generateCalendarDays();

  // Convert events for calendar component
  const calendarEvents = [
    ...allBirthdays.map(b => ({ ...b, isPast: isBefore(b.date, new Date()) && !isToday(b.date) })),
    ...allAnniversaries.map(a => ({ ...a, isPast: isBefore(a.date, new Date()) && !isToday(a.date) })),
    ...allHolidays.map(h => ({ ...h, isPast: isBefore(h.date, new Date()) && !isToday(h.date) }))
  ];

  // Get reminders for a specific day
  const getRemindersForDay = (day: Date) => {
    return reminders.filter(r => isSameDay(new Date(r.date), day));
  };

  const content = (
      <div className="flex-1 p-3 sm:p-4 md:p-6 bg-blue-50/30 min-h-screen max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Events & Calendar</h1>
                <p className="text-sm text-blue-700 mt-1">Company celebrations, holidays, and important dates</p>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
              onClick={() => {
                toast({
                  title: "Add Event",
                  description: "Event creation feature coming soon",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Modern Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 mb-1">Upcoming Birthdays</p>
                  <h3 className="text-3xl font-bold text-blue-900">{allBirthdays.filter(b => b.daysUntil <= 30).length}</h3>
                  <p className="text-xs text-blue-600 mt-2">Next 30 days</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                  <Cake className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-sky-700 mb-1">Anniversaries</p>
                  <h3 className="text-3xl font-bold text-sky-900">{allAnniversaries.filter(a => a.daysUntil <= 30).length}</h3>
                  <p className="text-xs text-sky-600 mt-2">Next 30 days</p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl border border-sky-200">
                  <PartyPopper className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-700 mb-1">Company Holidays</p>
                  <h3 className="text-3xl font-bold text-indigo-900">{allHolidays.length}</h3>
                  <p className="text-xs text-indigo-600 mt-2">This year</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl border border-indigo-200">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-cyan-700 mb-1">My Reminders</p>
                  <h3 className="text-3xl font-bold text-cyan-900">{reminders.filter(r => !r.completed).length}</h3>
                  <p className="text-xs text-cyan-600 mt-2">Active tasks</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-xl border border-cyan-200">
                  <AlarmClock className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Events</p>
                  <h3 className="text-3xl font-bold text-blue-900">{upcomingEvents.length}</h3>
                  <p className="text-xs text-blue-600 mt-2">Next 30 days</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-xl border border-blue-300">
                  <Bell className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 bg-blue-50/50 p-2 rounded-xl border border-blue-200">
            <TabsTrigger value="calendar" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="reminders" className="rounded-lg data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              <AlarmClock className="w-4 h-4 mr-2" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="birthdays" className="rounded-lg data-[state=active]:bg-sky-600 data-[state=active]:text-white">
              <Cake className="w-4 h-4 mr-2" />
              Birthdays
            </TabsTrigger>
            <TabsTrigger value="anniversaries" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <PartyPopper className="w-4 h-4 mr-2" />
              Anniversaries
            </TabsTrigger>
            <TabsTrigger value="holidays" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Holidays
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6">
            <Card className="border border-blue-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToToday}
                      className="rounded-lg border-blue-200 hover:bg-blue-50"
                    >
                      Today
                    </Button>
                    <div className="flex items-center gap-1 border border-blue-200 rounded-lg">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={goToPreviousMonth}
                        className="rounded-l-lg hover:bg-blue-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={goToNextMonth}
                        className="rounded-r-lg hover:bg-blue-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-px bg-blue-200 border-b border-blue-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-blue-700 py-3 bg-blue-50">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const dayReminders = getRemindersForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);

                    return (
                      <div
                        key={index}
                        className={`min-h-24 sm:min-h-32 p-2 bg-white ${
                          isTodayDate
                            ? 'bg-blue-50'
                            : !isCurrentMonth
                            ? 'bg-gray-50 text-gray-400'
                            : ''
                        }`}
                      >
                        <div className={`text-sm font-medium mb-2 ${
                          isTodayDate 
                            ? 'flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full' 
                            : 'text-gray-700'
                        }`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {/* Show reminders first */}
                          {dayReminders.slice(0, 1).map((reminder, rIdx) => (
                            <div
                              key={`reminder-${rIdx}`}
                              className={`text-xs p-1.5 rounded-lg cursor-pointer truncate border ${
                                reminder.completed 
                                  ? 'bg-gray-50 border-gray-200 text-gray-400 line-through' 
                                  : 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100'
                              }`}
                              onClick={() => handleToggleComplete(reminder.id)}
                              title={`${reminder.title} - ${reminder.time}`}
                            >
                              <div className="flex items-center gap-1">
                                <AlarmClock className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate font-medium">{reminder.title}</span>
                              </div>
                            </div>
                          ))}
                          {/* Then show events */}
                          {dayEvents.slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`text-xs p-1.5 rounded-lg cursor-pointer truncate border ${
                                event.type === 'birthday' ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' :
                                event.type === 'anniversary' ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100' :
                                'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                              }`}
                              onClick={() => handleNotifyAdmin(event)}
                              title={`${event.name} - ${event.type}`}
                            >
                              <span className="truncate font-medium">{event.name}</span>
                            </div>
                          ))}
                          {(dayEvents.length + dayReminders.length) > 3 && (
                            <div className="text-xs text-gray-500 font-medium pl-1">
                              +{(dayEvents.length + dayReminders.length) - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-50 border border-cyan-200 rounded"></div>
                <span className="text-blue-700">My Reminders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                <span className="text-blue-700">Birthdays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sky-50 border border-sky-200 rounded"></div>
                <span className="text-blue-700">Work Anniversaries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-50 border border-indigo-200 rounded"></div>
                <span className="text-blue-700">Company Holidays</span>
              </div>
            </div>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Reminders */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-cyan-900 flex items-center gap-2">
                        <AlarmClock className="w-5 h-5 text-cyan-600" />
                        My Reminders ({reminders.filter(r => !r.completed).length} active)
                      </CardTitle>
                      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-cyan-600 hover:bg-cyan-700 rounded-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            New Reminder
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Create New Reminder</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="title">Title *</Label>
                              <Input
                                id="title"
                                value={newReminder.title || ''}
                                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                                placeholder="e.g., Submit quarterly report"
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newReminder.description || ''}
                                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                                placeholder="Add details about this reminder..."
                                className="min-h-[80px]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={newReminder.date || ''}
                                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="time">Time</Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={newReminder.time || '09:00'}
                                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                  value={newReminder.priority || 'medium'}
                                  onValueChange={(value) => setNewReminder({ ...newReminder, priority: value as 'low' | 'medium' | 'high' })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                  value={newReminder.category || 'task'}
                                  onValueChange={(value) => setNewReminder({ ...newReminder, category: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="task">Task</SelectItem>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                    <SelectItem value="deadline">Deadline</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateReminder} className="bg-cyan-600 hover:bg-cyan-700">
                              Create Reminder
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {overdueReminders > 0 && (
                      <div className="bg-red-50 border-b border-red-200 p-4">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="w-5 h-5" />
                          <p className="text-sm font-medium">
                            You have {overdueReminders} overdue reminder{overdueReminders > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="divide-y divide-gray-200">
                      {reminders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <AlarmClock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="font-medium">No reminders yet</p>
                          <p className="text-sm mt-1">Create your first reminder to get started</p>
                        </div>
                      ) : (
                        reminders.map((reminder) => {
                          const CategoryIcon = getCategoryIcon(reminder.category);
                          const isOverdue = isPast(new Date(reminder.date)) && !isToday(new Date(reminder.date)) && !reminder.completed;
                          
                          return (
                            <div
                              key={reminder.id}
                              className={`p-4 hover:bg-blue-50 transition-colors ${
                                reminder.completed ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <button
                                  onClick={() => handleToggleComplete(reminder.id)}
                                  className="mt-1 flex-shrink-0"
                                >
                                  {reminder.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <div className="w-5 h-5 border-2 border-blue-300 rounded-full hover:border-cyan-500 transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <h4 className={`font-medium text-gray-900 ${reminder.completed ? 'line-through' : ''}`}>
                                        {reminder.title}
                                      </h4>
                                      {reminder.description && (
                                        <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                          <Calendar className="w-3 h-3" />
                                          {format(new Date(reminder.date), 'MMM dd, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                          <Bell className="w-3 h-3" />
                                          {reminder.time}
                                        </div>
                                        <Badge className={getPriorityColor(reminder.priority)}>
                                          {reminder.priority}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                          <CategoryIcon className="w-3 h-3 text-gray-400" />
                                          <span className="text-xs text-gray-500 capitalize">{reminder.category}</span>
                                        </div>
                                        {isOverdue && (
                                          <Badge className="bg-red-50 border-red-200 text-red-700">
                                            Overdue
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingReminder(reminder)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteReminder(reminder.id)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Reminders Sidebar */}
              <div className="space-y-4">
                <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-cyan-200 bg-gradient-to-r from-cyan-100 to-blue-100 pb-4">
                    <CardTitle className="text-sm font-semibold text-cyan-900">Upcoming Soon</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {upcomingReminders.length === 0 ? (
                      <p className="text-sm text-blue-600 text-center py-4">No upcoming reminders</p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingReminders.map((reminder) => {
                          const CategoryIcon = getCategoryIcon(reminder.category);
                          return (
                            <div key={reminder.id} className="p-3 bg-white border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <CategoryIcon className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{reminder.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {format(new Date(reminder.date), 'MMM dd')} at {reminder.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-100 to-sky-100 pb-4">
                    <CardTitle className="text-sm font-semibold text-blue-900">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Total</span>
                        <span className="font-semibold text-blue-900">{reminders.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Active</span>
                        <span className="font-semibold text-cyan-600">{reminders.filter(r => !r.completed).length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Completed</span>
                        <span className="font-semibold text-sky-600">{reminders.filter(r => r.completed).length}</span>
                      </div>
                      {overdueReminders > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-700">Overdue</span>
                          <span className="font-semibold text-red-600">{overdueReminders}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Birthdays Tab */}
          <TabsContent value="birthdays" className="mt-6">
            <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-100 to-sky-100 pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Cake className="w-5 h-5" />
                  Employee Birthdays ({allBirthdays.length} this year)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EventsTable
                  title="Employee Birthdays"
                  events={allBirthdays}
                  type="birthday"
                  onNotifyAdmin={handleNotifyAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anniversaries Tab */}
          <TabsContent value="anniversaries" className="mt-6">
            <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-sky-200 bg-gradient-to-r from-sky-100 to-cyan-100 pb-4">
                <CardTitle className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                  <PartyPopper className="w-5 h-5" />
                  Work Anniversaries ({allAnniversaries.length} this year)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EventsTable
                  title="Work Anniversaries"
                  events={allAnniversaries}
                  type="anniversary"
                  onNotifyAdmin={handleNotifyAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holidays Tab */}
          <TabsContent value="holidays" className="mt-6">
            <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-indigo-200 bg-gradient-to-r from-indigo-100 to-blue-100 pb-4">
                <CardTitle className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Company Holidays ({allHolidays.length} this year)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EventsTable
                  title="Company Holidays"
                  events={allHolidays}
                  type="holiday"
                  onNotifyAdmin={handleNotifyAdmin}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );

  // If standalone mode, wrap in DashboardLayout (for Admin portal)
  // Otherwise, return just the content (for other portals)
  return standalone ? (
    <DashboardLayout title="Events & Calendar" subtitle="Company Events & Celebrations">
      {content}
    </DashboardLayout>
  ) : (
    content
  );
};

export default Events;
