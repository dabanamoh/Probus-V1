
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  FileText, 
  Calendar, 
  Gift, 
  CreditCard,
  Bell,
  Shield,
  Settings,
  MessageSquare,
  Brain,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const kpiCards = [
    { title: "Total Numbers of Employees", value: "107", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/employees" },
    { title: "Employees On leave", value: "12", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/feedbacks" },
    { title: "Employees resigned", value: "5", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/resignations" },
    { title: "Total numbers of Managers", value: "5", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/employees" },
    { title: "Total Number of Employees Incident reports", value: "429", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/feedbacks" },
    { title: "Total Employees Promoted", value: "7", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/employees" },
    { title: "Total Employees Rewarded", value: "15", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/rewards" },
    { title: "Total Employees Punished", value: "15", color: "bg-gradient-to-br from-blue-400 to-blue-600", path: "/feedbacks" }
  ];

  const secondaryCards = [
    {
      title: "AI Analytics Dashboard",
      subtitle: "AI-powered insights, risk assessment, and trend analysis",
      color: "bg-gradient-to-br from-purple-100 to-purple-200",
      icon: Brain,
      path: "/ai-analytics",
      avatars: []
    },
    {
      title: "Team Chat & Communication",
      subtitle: "Secure messaging with AI-powered content analysis",
      color: "bg-gradient-to-br from-blue-100 to-blue-200", 
      icon: MessageSquare,
      path: "/chat",
      avatars: [
        { name: "User 1", image: "" },
        { name: "User 2", image: "" },
        { name: "User 3", image: "" },
        { name: "User 4", image: "" },
        { name: "User 5", image: "" }
      ]
    },
    {
      title: "Notice",
      subtitle: "View all notices sent to employees",
      color: "bg-gradient-to-br from-emerald-100 to-emerald-200",
      icon: Bell,
      path: "/notices",
      avatars: [
        { name: "User 1", image: "" },
        { name: "User 2", image: "" },
        { name: "User 3", image: "" },
        { name: "User 4", image: "" },
        { name: "User 5", image: "" }
      ]
    },
    {
      title: "Leave Applications",
      subtitle: "All leave applications and status",
      color: "bg-gradient-to-br from-orange-100 to-orange-200",
      icon: Calendar,
      path: "/feedbacks",
      avatars: [
        { name: "User 1", image: "" },
        { name: "User 2", image: "" },
        { name: "User 3", image: "" },
        { name: "User 4", image: "" },
        { name: "User 5", image: "" }
      ]
    },
    {
      title: "Permissions",
      subtitle: "Manage all employees access and assets Permission",
      color: "bg-gradient-to-br from-green-100 to-green-200",
      icon: Shield,
      path: "/employees",
      avatars: [
        { name: "User 1", image: "" },
        { name: "User 2", image: "" },
        { name: "User 3", image: "" },
        { name: "User 4", image: "" },
        { name: "User 5", image: "" }
      ]
    },
    {
      title: "Salary Slip",
      subtitle: "Maintain Employees salary slip",
      color: "bg-gradient-to-br from-pink-100 to-pink-200",
      icon: CreditCard,
      path: "/employees",
      avatars: []
    },
    {
      title: "Birthdays / Work Anniversaries",
      subtitle: "Upcoming employee birthdays and work anniversaries",
      color: "bg-gradient-to-br from-cyan-100 to-cyan-200",
      icon: Gift,
      path: "/events",
      avatars: [
        { name: "User 1", image: "" },
        { name: "User 2", image: "" },
        { name: "User 3", image: "" },
        { name: "User 4", image: "" },
        { name: "User 5", image: "" }
      ]
    },
    {
      title: "Holiday",
      subtitle: "Holidays in the calendar year",
      color: "bg-gradient-to-br from-purple-100 to-purple-200",
      icon: Calendar,
      path: "/events",
      avatars: []
    }
  ];

  const handleCardClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">ADMIN Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Settings 
              className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" 
              onClick={handleSettingsClick}
            />
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
              <span className="text-gray-600 font-medium text-sm">⏻</span>
            </div>
          </div>
        </div>
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <Card 
              key={index} 
              className={`${card.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 cursor-pointer hover:scale-105`}
              onClick={() => handleCardClick(card.path)}
            >
              <CardContent className="p-6">
                <div className="text-sm opacity-90 mb-2">{card.title}</div>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secondaryCards.map((card, index) => (
            <Card 
              key={index} 
              className={`${card.color} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-0`}
              onClick={() => handleCardClick(card.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <card.icon className="w-5 h-5" />
                    {card.title}
                  </CardTitle>
                  <div className="w-6 h-6 bg-white bg-opacity-50 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">{card.subtitle}</p>
                {card.avatars && card.avatars.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">People Added</p>
                    <div className="flex -space-x-2">
                      {card.avatars.map((avatar, avatarIndex) => (
                        <Avatar key={avatarIndex} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                            {avatar.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
