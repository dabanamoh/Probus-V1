import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Shield,
  Users,
  UserCog,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';

interface Portal {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  color: string;
}

const PortalSwitcher = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPortal, setCurrentPortal] = useState('admin');

  // Get current path to determine active portal
  const getCurrentPortal = () => {
    const path = window.location.pathname;
    if (path.startsWith('/hr')) return 'hr';
    if (path.startsWith('/manager')) return 'manager';
    if (path.startsWith('/app')) return 'employee';
    return 'admin';
  };

  // Define all portals
  const portals: Portal[] = [
    {
      id: 'admin',
      name: 'Admin Portal',
      description: 'System administration and configuration',
      icon: <Shield className="w-4 h-4" />,
      path: '/admin',
      color: 'purple',
      badge: '6'
    },
    {
      id: 'hr',
      name: 'HR Portal',
      description: 'Employee management and HR functions',
      icon: <Users className="w-4 h-4" />,
      path: '/hr',
      color: 'blue',
      badge: '12'
    },
    {
      id: 'manager',
      name: 'Manager Portal',
      description: 'Team management and approvals',
      icon: <UserCog className="w-4 h-4" />,
      path: '/manager',
      color: 'green',
      badge: '8'
    },
    {
      id: 'employee',
      name: 'Employee Portal',
      description: 'Personal workspace and tasks',
      icon: <Briefcase className="w-4 h-4" />,
      path: '/app',
      color: 'gray'
    }
  ];

  // Get user's available portals based on role
  const getAvailablePortals = () => {
    const role = user?.role || 'employee';
    
    // For small businesses: admin has access to all portals
    if (role === 'admin') {
      return portals;
    }
    
    // HR has access to HR and employee portals
    if (role === 'hr') {
      return portals.filter(p => ['hr', 'employee'].includes(p.id));
    }
    
    // Manager has access to manager and employee portals
    if (role === 'manager') {
      return portals.filter(p => ['manager', 'employee'].includes(p.id));
    }
    
    // Regular employees only see their portal
    return portals.filter(p => p.id === 'employee');
  };

  const availablePortals = getAvailablePortals();
  const activePortal = portals.find(p => p.id === getCurrentPortal());

  const handlePortalSwitch = (portal: Portal) => {
    setCurrentPortal(portal.id);
    navigate(portal.path);
  };

  const getColorClasses = (color: string, active: boolean = false) => {
    const colors = {
      purple: active ? 'bg-purple-50 text-purple-700 border-purple-200' : 'hover:bg-purple-50',
      blue: active ? 'bg-blue-50 text-blue-700 border-blue-200' : 'hover:bg-blue-50',
      green: active ? 'bg-green-50 text-green-700 border-green-200' : 'hover:bg-green-50',
      gray: active ? 'bg-gray-50 text-gray-700 border-gray-200' : 'hover:bg-gray-50'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-700',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      gray: 'bg-gray-100 text-gray-700'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  // Don't show switcher if user only has access to one portal
  if (availablePortals.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${getColorClasses(activePortal?.color || 'gray', true)} border-2`}
        >
          {activePortal?.icon}
          <span className="font-medium">{activePortal?.name || 'Select Portal'}</span>
          {activePortal?.badge && (
            <Badge className={getBadgeColor(activePortal.color)}>
              {activePortal.badge}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">
          Switch Portal View
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availablePortals.map((portal) => (
          <DropdownMenuItem
            key={portal.id}
            onClick={() => handlePortalSwitch(portal)}
            className={`p-3 cursor-pointer ${
              portal.id === getCurrentPortal() ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3 w-full">
              <div className={`p-2 rounded-lg ${getColorClasses(portal.color, false)}`}>
                {portal.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{portal.name}</p>
                  {portal.badge && (
                    <Badge className={getBadgeColor(portal.color)} variant="secondary">
                      {portal.badge} pending
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{portal.description}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-gray-500">
          <p className="font-medium mb-1">💡 Pro Tip for Small Businesses:</p>
          <p>As an admin, you can access all portals to handle HR, management, and administrative tasks from one account.</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PortalSwitcher;
