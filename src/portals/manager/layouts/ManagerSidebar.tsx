import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';
import appSessionService from '@/services/appSessionService';
import { 
  Home,
  Mail, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Users, 
  BookOpen,
  Settings as SettingsIcon,
  Shield,
  Grid,
  MessageSquare,
  Minus,
  Inbox,
  BarChart3
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import ThemeToggle from '../../shared/components/misc/ThemeToggle';

interface ManagerSidebarProps {
  className?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ManagerSidebar = ({ className, activeTab, setActiveTab }: ManagerSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedInApps, setLoggedInApps] = useState<any[]>([]);

  // Load logged-in apps
  useEffect(() => {
    const loadLoggedInApps = () => {
      const apps = appSessionService.getLoggedInApps();
      setLoggedInApps(apps);
    };
    
    loadLoggedInApps();
    
    // Listen for storage changes (app login/logout)
    const handleStorageChange = () => {
      loadLoggedInApps();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('app-session-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app-session-changed', handleStorageChange);
    };
  }, []);

  // Map app icons
  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return Mail;
      case 'calendar': return Calendar;
      case 'message-circle': return MessageSquare;
      case 'video': return Grid;
      default: return Grid;
    }
  };

  // Handle app logout
  const handleAppLogout = (appId: string) => {
    appSessionService.removeLoggedInApp(appId);
    setLoggedInApps(appSessionService.getLoggedInApps());
    // Trigger storage event for other components
    window.dispatchEvent(new Event('app-session-changed'));
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", id: "dashboard", active: activeTab === "dashboard" },
    { icon: Shield, label: "My Work", id: "approvals", active: activeTab === "approvals" },
    { icon: Users, label: "Team Management", id: "team", active: activeTab === "team" },
    { icon: Calendar, label: "Events & Calendar", id: "events", active: activeTab === "events" },
    { icon: Mail, label: "Email", id: "mail", active: activeTab === "mail" },
    { icon: FileText, label: "Tasks", id: "tasks", active: activeTab === "tasks" },
    { icon: BarChart3, label: "KPI Management", id: "kpis", active: activeTab === "kpis" },
    { icon: Inbox, label: "Reports", id: "reports", active: activeTab === "reports" },
    { icon: Clock, label: "Time Tracking", id: "time", active: activeTab === "time" },
    { icon: Users, label: "Directory", id: "directory", active: activeTab === "directory" },
    { icon: BookOpen, label: "Rules & Ethics", id: "rules", active: activeTab === "rules" },
    { icon: Shield, label: "Whistleblower", id: "whistleblower", active: activeTab === "whistleblower" },
    { icon: Grid, label: "Apps", id: "apps", active: activeTab === "apps" },
  ];

  return (
    <div className={cn(
      "w-64 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 h-screen flex flex-col shadow-sm border-r border-gray-200 dark:border-slate-800 fixed top-0 left-0",
      className
    )}>
      {/* Logo and Brand */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <img 
              src="/Probus Logo white.svg" 
              alt="Probus Logo" 
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2273%) hue-rotate(199deg) brightness(101%) contrast(91%)' }}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-slate-50">Probus</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Manager Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                  item.active 
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  item.active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-slate-400"
                )} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        
        {/* Quick Access Apps */}
        {loggedInApps.length > 0 && (
          <div className="mt-6 px-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
              Quick Access
            </div>
            <ul className="space-y-1">
              {loggedInApps.map((app) => {
                const AppIcon = getAppIcon(app.icon);
                return (
                  <li key={app.id}>
                    <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium group">
                      <div className="flex items-center gap-3">
                        <AppIcon className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                        <span>{app.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppLogout(app.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-all"
                        title="Disconnect app"
                      >
                        <Minus className="w-3 h-3 text-gray-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-800">
        {/* Theme Toggle */}
        <div className="mb-3">
          <ThemeToggle variant="icon-only" className="w-full justify-center" />
        </div>
        
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-blue-600 dark:bg-blue-700 text-white text-sm font-semibold">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium truncate text-gray-900 dark:text-slate-100">John Doe</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">Manager</p>
          </div>
          <SettingsIcon className="w-4 h-4 text-gray-400 dark:text-slate-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;
