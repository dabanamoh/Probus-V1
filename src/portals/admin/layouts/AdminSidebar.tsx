import React from 'react';
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  UserX,
  Award,
  Settings,
  Calendar,
  TrendingUp,
  FileText,
  Bell,
  MessageCircle,
  Mail,
  LogOut,
  Inbox,
  Shield,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../shared/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '../../shared/components/misc/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shared/ui/dropdown-menu";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Inbox, label: "My Work", path: "/work" },
    { icon: Mail, label: "Email", path: "/email" },
    { icon: Shield, label: "Safety & AI", path: "/safety" },
    { icon: Users, label: "People", path: "/employees" },
    { icon: Building2, label: "Departments", path: "/departments" },
    { icon: Bell, label: "Communications", path: "/notices" },
    { icon: Calendar, label: "Events & Calendar", path: "/events" },
    { icon: UserX, label: "Offboarding", path: "/resignations" },
    { icon: Award, label: "Recognition", path: "/rewards" },
    { icon: MessageCircle, label: "Feedback", path: "/feedbacks" },
    { icon: Clock, label: "Time Tracking", path: "/time-config" },
    { icon: TrendingUp, label: "Insights", path: "/kpis" }
  ];

  return (
    <div className={cn(
      "w-64 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 h-screen flex flex-col shadow-sm border-r border-gray-200 dark:border-slate-800 fixed top-0 left-0",
      className
    )}>
      {/* Logo and Brand */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
            <p className="text-xs text-gray-500 dark:text-slate-400">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-slate-400"
                    )} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-blue-600 dark:bg-blue-700 text-white font-semibold text-sm">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate text-gray-900 dark:text-slate-100">{user?.name || 'Admin User'}</p>
                <p className="text-xs truncate text-gray-500 dark:text-slate-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <Settings className="w-4 h-4 text-gray-400 dark:text-slate-400 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
