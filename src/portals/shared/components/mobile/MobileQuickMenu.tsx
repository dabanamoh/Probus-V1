import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Bell,
  Settings 
} from 'lucide-react';

const MobileQuickMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 max-w-full">
      <div className="bg-white/70 backdrop-blur-xl border-t border-white/30 shadow-2xl">
        <div className="flex justify-around items-center py-3 px-2 sm:px-4 gap-1 sm:gap-2 max-w-full overflow-x-auto">
          <button 
            onClick={() => navigate('/employees')}
            className="flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/60 transition-all active:scale-95 flex-shrink-0 min-w-[60px]"
          >
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">People</span>
          </button>
          
          <button 
            onClick={() => navigate('/notices')}
            className="flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/60 transition-all active:scale-95 flex-shrink-0 min-w-[60px]"
          >
            <Bell className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Comms</span>
          </button>
          
          <button 
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/60 transition-all active:scale-95 flex-shrink-0 min-w-[60px]"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileQuickMenu;
