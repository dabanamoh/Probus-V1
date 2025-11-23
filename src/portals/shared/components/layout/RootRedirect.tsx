import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Index from '@/portals/admin/pages/Dashboard';

const LoadingSpinner = () => (
  <div className="flex min-h-screen bg-gray-50 w-full items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  console.log('RootRedirect - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on role
  console.log('User authenticated, role:', user?.role);
  if (user?.role === 'admin') return <Index />;
  if (user?.role === 'employee') return <Navigate to="/app" replace />;
  if (user?.role === 'manager') return <Navigate to="/manager" replace />;
  if (user?.role === 'hr') return <Navigate to="/hr" replace />;
  
  console.log('No role match, redirecting to login');
  return <Navigate to="/login" replace />;
};

export default RootRedirect;
