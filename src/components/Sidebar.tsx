
import React from 'react';
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  UserX, 
  Award, 
  BarChart3, 
  MessageSquare,
  User,
  Settings,
  Calendar
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Building2, label: "Departments", path: "/departments", active: location.pathname === "/departments" },
    { icon: Users, label: "Employees", path: "/employees", active: location.pathname === "/employees" },
    { icon: UserX, label: "Resignations/Terminations", path: "/resignations", active: location.pathname === "/resignations" },
    { icon: Award, label: "Rewards / Punishment", path: "/rewards", active: location.pathname === "/rewards" },
    { icon: BarChart3, label: "KPI", path: "/kpi", active: location.pathname === "/kpi" },
    { icon: MessageSquare, label: "Feedbacks", path: "/feedbacks", active: location.pathname === "/feedbacks" },
    { icon: Calendar, label: "Events", path: "/events", active: location.pathname === "/events" },
  ];

  return (
    <div className={cn(
      "w-64 bg-gradient-to-b from-blue-400 to-blue-600 text-white h-screen flex flex-col shadow-xl",
      className
    )}>
      {/* Logo and Brand */}
      <div className="p-6 border-b border-blue-500 border-opacity-30">
        <div className="flex items-center space-x-3 mb-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">IntegrityMerit</h2>
            <p className="text-xs opacity-80">Empowering Excellence, Rewarding Integrity</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-20 hover:translate-x-1 text-left",
                  item.active && "bg-white bg-opacity-20"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-500 border-opacity-30">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-white text-blue-600 font-semibold">
              PS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Paul Shark</p>
            <p className="text-xs opacity-80 truncate">Administrator</p>
          </div>
        </div>
        
        <div className="mt-3 flex justify-center">
          <div 
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all duration-200"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
