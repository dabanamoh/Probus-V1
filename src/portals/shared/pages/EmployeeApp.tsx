import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDashboard from '../../employee/pages/Dashboard';

const EmployeeApp = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check auth state)
    // For demo purposes, we'll simulate a logged in state
    // In a real app, you would check for a valid token or session
    const loggedIn = localStorage.getItem('isEmployeeLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // If not logged in, redirect to login page
    if (!loggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // For demo purposes, we'll show the dashboard directly
  // In a real app, you would implement proper authentication
  return <EmployeeDashboard />;
};

export default EmployeeApp;
