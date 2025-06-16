
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default Index;
