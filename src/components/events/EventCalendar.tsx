
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Gift, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';

interface CalendarEvent {
  id: string;
  name: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'holiday';
  yearsOfService?: number;
  isPast?: boolean;
}

interface EventCalendarProps {
  month: Date;
  events: CalendarEvent[];
  onNotifyAdmin: (event: CalendarEvent) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ month, events, onNotifyAdmin }) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const getEventColor = (event: CalendarEvent) => {
    const isPast = isBefore(event.date, new Date()) && !isToday(event.date);
    
    if (isPast) return 'bg-gray-300 text-gray-600';
    
    switch (event.type) {
      case 'birthday':
        return isToday(event.date) ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-800';
      case 'anniversary':
        return isToday(event.date) ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800';
      case 'holiday':
        return isToday(event.date) ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Gift className="w-3 h-3" />;
      case 'anniversary':
        return <Users className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {format(month, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={index}
                className={`min-h-20 p-1 border rounded ${
                  isToday(day) ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium ${
                  isToday(day) ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded cursor-pointer ${getEventColor(event)}`}
                      onClick={() => onNotifyAdmin(event)}
                      title={`${event.name} - ${event.type}`}
                    >
                      <div className="flex items-center gap-1">
                        {getEventIcon(event.type)}
                        <span className="truncate">{event.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
