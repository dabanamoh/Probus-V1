import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import aiMonitoringService, { 
  ThreatAlert, 
  ProductivityInsight, 
  ComplianceIssue 
} from '@/services/aiMonitoringService';

export const useThreatAlerts = () => {
  return useQuery<ThreatAlert[], Error>({
    queryKey: ['threat-alerts'],
    queryFn: () => aiMonitoringService.getThreatAlerts(),
  });
};

export const useActiveThreatAlerts = () => {
  return useQuery<ThreatAlert[], Error>({
    queryKey: ['active-threat-alerts'],
    queryFn: () => aiMonitoringService.getActiveThreatAlerts(),
  });
};

export const useProductivityInsights = () => {
  return useQuery<ProductivityInsight[], Error>({
    queryKey: ['productivity-insights'],
    queryFn: () => aiMonitoringService.getProductivityInsights(),
  });
};

export const useComplianceIssues = () => {
  return useQuery<ComplianceIssue[], Error>({
    queryKey: ['compliance-issues'],
    queryFn: () => aiMonitoringService.getComplianceIssues(),
  });
};

export const useDismissThreatAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alertId: string) => aiMonitoringService.dismissThreatAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['active-threat-alerts'] });
    },
  });
};

export const useResolveComplianceIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (issueId: string) => aiMonitoringService.resolveComplianceIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-issues'] });
    },
  });
};