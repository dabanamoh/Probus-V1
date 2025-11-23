import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Calendar as CalendarIcon, Gift, Users } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, isSameMonth } from 'date-fns';

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
    
    if (isPast) return 'bg-gray-100 text-gray-500 border-gray-200';
    
    switch (event.type) {
      case 'birthday':
        return isToday(event.date) 
          ? 'bg-pink-500 text-white border-pink-600' 
          : 'bg-pink-100 text-pink-800 border-pink-200';
      case 'anniversary':
        return isToday(event.date) 
          ? 'bg-purple-500 text-white border-purple-600' 
          : 'bg-purple-100 text-purple-800 border-purple-200';
      case 'holiday':
        return isToday(event.date) 
          ? 'bg-green-500 text-white border-green-600' 
          : 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {format(month, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, month);
            const isTodayDate = isToday(day);
            
            return (
              <div
                key={index}
                className={`min-h-16 p-1 rounded-lg border ${
                  isTodayDate 
                    ? 'bg-blue-50 border-blue-300' 
                    : isCurrentMonth 
                      ? 'border-gray-200 bg-white' 
                      : 'border-gray-100 bg-gray-50 text-gray-400'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isTodayDate ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded border cursor-pointer truncate ${getEventColor(event)}`}
                      onClick={() => onNotifyAdmin(event)}
                      title={`${event.name} - ${event.type}`}
                    >
                      <div className="flex items-center gap-1">
                        {getEventIcon(event.type)}
                        <span className="truncate">{event.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayEvents.length - 2}
                    </div>
                  )}
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
