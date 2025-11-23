import React from 'react';
import { Calendar, Clock, Users, Video, FileText } from 'lucide-react';
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";

interface MeetingMessageProps {
  meeting: {
    id: string;
    title: string;
    description?: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    start_time: string;
    end_time: string;
    participants: { id: string; name: string; avatar?: string }[];
    recording_url?: string;
  };
  isOwn: boolean;
  onJoin?: () => void;
}

const MeetingMessage: React.FC<MeetingMessageProps> = ({ meeting, isOwn, onJoin }) => {
  const getStatusColor = () => {
    switch (meeting.status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (meeting.status) {
      case 'scheduled': return 'Scheduled';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return meeting.status;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex items-center justify-center my-2">
      <div className="bg-gray-100 rounded-lg p-4 max-w-md w-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-full">
              <Video className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">{meeting.title}</h4>
              <p className="text-xs text-gray-500">Meeting</p>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(meeting.start_time)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>
              {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{meeting.participants.length} participants</span>
          </div>
          
          {meeting.description && (
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
              <span className="text-gray-600">{meeting.description}</span>
            </div>
          )}
        </div>

        {meeting.status === 'scheduled' && onJoin && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
            <Button size="sm" onClick={onJoin}>
              Join Meeting
            </Button>
          </div>
        )}

        {meeting.status === 'completed' && meeting.recording_url && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
            <Button variant="outline" size="sm">
              View Recording
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingMessage;
