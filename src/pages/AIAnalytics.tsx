
import React from 'react';
import Sidebar from '@/components/Sidebar';
import AIDashboard from '@/components/ai/AIDashboard';

const AIAnalytics = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1">
        <AIDashboard />
      </div>
    </div>
  );
};

export default AIAnalytics;
