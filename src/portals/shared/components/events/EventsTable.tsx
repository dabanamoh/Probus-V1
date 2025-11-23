
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Bell, Gift, Users, Calendar } from 'lucide-react';
import { format, isToday, isBefore } from 'date-fns';

interface EventTableItem {
  id: string;
  name: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'holiday';
  position?: string;
  yearsOfService?: number;
  description?: string;
  daysUntil: number;
}

interface EventsTableProps {
  title: string;
  events: EventTableItem[];
  type: 'birthday' | 'anniversary' | 'holiday';
  onNotifyAdmin: (event: EventTableItem) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({ title, events, type, onNotifyAdmin }) => {
  const getStatusBadge = (event: EventTableItem) => {
    const isPast = isBefore(event.date, new Date()) && !isToday(event.date);
    
    if (isPast) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-600">Celebrated</Badge>;
    }
    
    if (isToday(event.date)) {
      return <Badge className="bg-blue-600 text-white">Today!</Badge>;
    }
    
    if (event.daysUntil <= 7) {
      return <Badge className="bg-orange-500 text-white">This Week</Badge>;
    }
    
    if (event.daysUntil <= 30) {
      return <Badge variant="outline" className="border-green-500 text-green-700">This Month</Badge>;
    }
    
    return <Badge variant="outline">{event.daysUntil} days</Badge>;
  };

  const getRowClassName = (event: EventTableItem) => {
    const isPast = isBefore(event.date, new Date()) && !isToday(event.date);
    
    if (isPast) return "bg-gray-50 opacity-70";
    if (isToday(event.date)) return "bg-blue-50 border-l-4 border-blue-500";
    if (event.daysUntil <= 7) return "bg-orange-50 border-l-4 border-orange-500";
    return "hover:bg-gray-50";
  };

  const getIcon = () => {
    switch (type) {
      case 'birthday':
        return <Gift className="w-5 h-5 text-pink-600" />;
      case 'anniversary':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'holiday':
        return <Calendar className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No events to display</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {type !== 'holiday' && <TableHead>Position</TableHead>}
                <TableHead>Date</TableHead>
                {type === 'anniversary' && <TableHead>Years</TableHead>}
                {type === 'holiday' && <TableHead>Description</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} className={getRowClassName(event)}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {type !== 'holiday' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {event.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="font-medium">{event.name}</span>
                    </div>
                  </TableCell>
                  {type !== 'holiday' && (
                    <TableCell className="text-sm text-gray-600">
                      {event.position || 'Employee'}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{format(event.date, 'MMM dd, yyyy')}</span>
                      <span className="text-xs text-gray-500">{format(event.date, 'EEEE')}</span>
                    </div>
                  </TableCell>
                  {type === 'anniversary' && (
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {event.yearsOfService} year{event.yearsOfService !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                  )}
                  {type === 'holiday' && (
                    <TableCell className="text-sm text-gray-600">
                      {event.description || '-'}
                    </TableCell>
                  )}
                  <TableCell>
                    {getStatusBadge(event)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNotifyAdmin(event)}
                      className="h-8"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      Notify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsTable;
