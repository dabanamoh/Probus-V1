import React from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Settings, 
  Clock,
  Grid,
  Users,
  FileText,
  Shield,
  UserPlus,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  Inbox,
  Calendar
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import ThemeToggle from '../../shared/components/misc/ThemeToggle';

interface HRSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

const HRSidebar = ({ activeTab, setActiveTab, className }: HRSidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", active: activeTab === "dashboard" },
    { icon: ClipboardCheck, label: "My Work", id: "approvals", active: activeTab === "approvals" },
    { icon: Users, label: "Employees", id: "employees", active: activeTab === "employees" },
    { icon: Calendar, label: "Events & Calendar", id: "events", active: activeTab === "events" },
    { icon: UserPlus, label: "Recruitment", id: "recruitment", active: activeTab === "recruitment" },
    { icon: FileText, label: "Policies", id: "policies", active: activeTab === "policies" },
    { icon: Shield, label: "Whistleblower", id: "whistleblower", active: activeTab === "whistleblower" },
    { icon: BarChart3, label: "HR Reports", id: "reports", active: activeTab === "reports" },
    { icon: BookOpen, label: "Directory", id: "directory", active: activeTab === "directory" },
    { icon: Mail, label: "Email", id: "email", active: activeTab === "email" },
    { icon: Clock, label: "Time Tracking", id: "time", active: activeTab === "time" },
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
            <p className="text-xs text-gray-500 dark:text-slate-400">HR Portal</p>
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
            <AvatarFallback className="bg-blue-600 dark:bg-blue-700 text-white text-sm font-semibold">HR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium truncate text-gray-900 dark:text-slate-100">HR Manager</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">Human Resources</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 dark:text-slate-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default HRSidebar;
