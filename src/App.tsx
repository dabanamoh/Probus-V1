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
import FirstLoginWizard from "./portals/shared/components/FirstLoginWizard";
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
const PendingEmployees = lazy(() => import("./portals/admin/pages/PendingEmployees"));
const Notices = lazy(() => import("./portals/admin/pages/Notices"));
const Settings = lazy(() => import("./portals/admin/pages/Settings"));
const Notifications = lazy(() => import("./portals/admin/pages/Notifications"));
const AdminApprovals = lazy(() => import("./portals/admin/pages/Approvals"));
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
                  <Route path="/first-login" element={<FirstLoginWizard />} />

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
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/departments" element={
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Departments />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/employees" element={
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Employees />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  <Route path="/pending-employees" element={
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <PendingEmployees />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/approvals" element={
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminApprovals />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  <Route path="/notices" element={
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
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

                  <Route path="/notifications" element={
                    <ProtectedRoute allowedRoles={['admin', 'owner']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Notifications />
                      </Suspense>
                    </ProtectedRoute>
                  } />

                  {/* Leadership Routes (Manager, Supervisor, Director, Head of Department) */}
                  <Route path="/manager/*" element={
                    <ProtectedRoute allowedRoles={['manager', 'supervisor', 'director', 'hod']}>
                      <Suspense fallback={<LoadingSpinner />}>
                        <ManagerDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  {/* Alias route for future - Leadership Portal */}
                  <Route path="/leadership/*" element={
                    <ProtectedRoute allowedRoles={['manager', 'supervisor', 'director', 'hod']}>
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

                  {/* Employee Routes - Only for employees without management responsibilities */}
                  <Route path="/app/*" element={
                    <ProtectedRoute allowedRoles={['employee']}>
                      <EmployeeApp />
                    </ProtectedRoute>
                  } />

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