import { Toaster } from "@/portals/shared/ui/toaster";
import { Toaster as Sonner } from "@/portals/shared/ui/sonner";
import { TooltipProvider } from "@/portals/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import Index from "./portals/admin/pages/Dashboard";
import EmployeeApp from "./portals/shared/pages/EmployeeApp";
import Login from "./portals/shared/pages/Login";
import Registration from "./portals/shared/pages/Registration";
import Onboarding from "./portals/employee/pages/Onboarding";
import NotFound from "./portals/shared/pages/NotFound";
import FloatingChat from "./portals/shared/components/misc/FloatingChat";
import CommandPalette from "./portals/shared/components/misc/CommandPalette";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./portals/shared/components/layout/ProtectedRoute";
import RootRedirect from "./portals/shared/components/layout/RootRedirect";

// Lazy load pages for better performance - MVP ONLY
const Departments = lazy(() => import("./portals/admin/pages/Departments"));
const Employees = lazy(() => import("./portals/admin/pages/Employees"));
const Notices = lazy(() => import("./portals/admin/pages/Notices"));
const Settings = lazy(() => import("./portals/admin/pages/Settings"));
const MyWork = lazy(() => import("./portals/employee/pages/MyWork"));
const SafetyDashboard = lazy(() => import("./portals/admin/pages/SafetyDashboard"));
const ManagerDashboard = lazy(() => import("./portals/manager/pages/Dashboard"));
const HRDashboard = lazy(() => import("./portals/hr/pages/Dashboard"));

// Configure React Query with better defaults for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading component for lazy loaded pages
const LoadingSpinner = () => (
  <div className="flex min-h-screen bg-gray-50 w-full items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  console.log('App component rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <TooltipProvider>
              <div className="min-h-screen overflow-x-hidden max-w-full">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Registration />} />
                  <Route path="/onboarding" element={<Onboarding />} />


                  {/* My Work - Universal Inbox for all roles */}
                  <Route path="/work" element={
                    <ProtectedRoute allowedRoles={['admin', 'employee', 'manager', 'hr']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <MyWork />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  {/* Safety & Productivity Dashboard */}
                  <Route path="/safety" element={
                    <ProtectedRoute allowedRoles={['admin', 'hr']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <SafetyDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/departments" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Departments />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/employees" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Employees />
                      </Suspense>
                    </ProtectedRoute>
                  } />




                  <Route path="/notices" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Notices />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  <Route path="/settings" element={
                    <ProtectedRoute allowedRoles={['admin', 'employee', 'manager', 'hr']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  } />




                  {/* Manager Routes */}
                  <Route path="/manager/*" element={
                    <ProtectedRoute allowedRoles={['manager']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <ManagerDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  {/* HR Routes */}
                  <Route path="/hr/*" element={
                    <ProtectedRoute allowedRoles={['hr']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <HRDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  {/* Employee Routes */}
                  <Route path="/app/*" element={
                    <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
                      <EmployeeApp />
                    </ProtectedRoute>
                  } />

                  <Route path="/test-chat" element={<div>Test Chat Disabled</div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                {/* Global Floating Chat - Available on all pages */}
                <FloatingChat />

                {/* Global Command Palette - Ctrl+K anywhere */}
                <CommandPalette />
              </div>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;