import { useState, useEffect } from 'react';

// Types for employee statistics
export interface EmployeeStats {
  pendingEmails: number;
  unreadChats: number;
  announcements: number;
  leaveDays: number;
  lateResumptionDays: number;
  pendingTasks: number;
  completedTasks: number;
  upcomingMeetings: number;
  missedCalls: number;
}

// Mock data for demonstration
const mockStats: EmployeeStats = {
  pendingEmails: 12,
  unreadChats: 5,
  announcements: 3,
  leaveDays: 2,
  lateResumptionDays: 1,
  pendingTasks: 7,
  completedTasks: 15,
  upcomingMeetings: 4,
  missedCalls: 2
};

export const useEmployeeStats = (userId: string) => {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real implementation, this would fetch from your backend
        // const response = await fetch(`/api/employee/${userId}/stats`);
        // const data = await response.json();
        // setStats(data);
        
        // For now, using mock data
        setStats(mockStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
};