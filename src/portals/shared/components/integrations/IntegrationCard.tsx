import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { 
  Mail, 
  Calendar, 
  MessageCircle, 
  Plug,
  CheckCircle,
  AlertCircle,
  Video,
  Settings,
  ExternalLink,
  Trash2,
  RefreshCw,
  Activity,
  TrendingUp
} from 'lucide-react';

interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt: string | null;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

const IntegrationCard = ({ 
  id, 
  name, 
  description, 
  icon, 
  category, 
  status, 
  connectedAt, 
  onConnect, 
  onDisconnect 
}: IntegrationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Map integration icon names to actual components
  const getIntegrationIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return Mail;
      case 'calendar': return Calendar;
      case 'message-circle': return MessageCircle;
      case 'video': return Video;
      default: return Plug;
    }
  };

  const IconComponent = getIntegrationIcon(icon);

  return (
    <Card className="hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2.5 rounded-lg ${
              status === 'connected' 
                ? 'bg-blue-100 dark:bg-blue-500/10' 
                : status === 'error' 
                ? 'bg-red-100 dark:bg-red-500/10' 
                : 'bg-gray-100 dark:bg-slate-700'
            }`}>
              <IconComponent className={`w-5 h-5 ${
                status === 'connected' 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : status === 'error' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-slate-300'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base dark:text-slate-100 truncate">{name}</CardTitle>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{category}</p>
            </div>
          </div>
          {status === 'connected' && <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />}
          {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">{description}</p>
        
        {status === 'connected' && connectedAt && (
          <p className="text-xs text-gray-500 dark:text-slate-500">
            Connected {new Date(connectedAt).toLocaleDateString()}
          </p>
        )}
        
        <div className="pt-1">
          {status === 'connected' ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDisconnect(id)}
              className="w-full dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Disconnect
            </Button>
          ) : status === 'error' ? (
            <Button 
              size="sm"
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={() => onConnect(id)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reconnect
            </Button>
          ) : (
            <Button 
              className="w-full"
              onClick={() => onConnect(id)}
            >
              <Plug className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
