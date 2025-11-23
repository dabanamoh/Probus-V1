import React, { useState } from 'react';
import Sidebar from '../../../admin/layouts/AdminSidebar';
import MobileHeader from '../mobile/MobileHeader';
import MobileQuickMenu from '../mobile/MobileQuickMenu';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    title = "Admin Dashboard",
    subtitle = "Probus"
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-x-hidden max-w-full">
            {/* Mobile Header */}
            <MobileHeader
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                title={title}
                subtitle={subtitle}
            />

            {/* Sidebar - responsive layout */}
            <div className={`w-64 h-full fixed top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:z-auto`}>
                <Sidebar />
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main content area */}
            <div className="flex-1 mt-16 md:mt-0 mb-20 md:mb-0 overflow-auto max-w-full overflow-x-hidden">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </div>

            {/* Mobile Quick Menu */}
            <MobileQuickMenu />
        </div>
    );
};

export default DashboardLayout;
