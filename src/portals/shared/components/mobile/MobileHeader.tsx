import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title?: string;
  subtitle?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  title = "Admin Dashboard",
  subtitle = "Probus"
}) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <img 
            src="/Probus Logo white.svg" 
            alt="Probus Logo" 
            className="w-8 h-8 object-contain bg-[#0095FF] rounded-full p-1.5"
          />
          <div>
            <h2 className="text-sm font-bold text-gray-800">{subtitle}</h2>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-md bg-blue-500 text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
