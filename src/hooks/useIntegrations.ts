import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import integrationService, { Integration } from '@/services/integrationService';

export const useIntegrations = () => {
  return useQuery<Integration[], Error>({
    queryKey: ['integrations'],
    queryFn: () => integrationService.getAllIntegrations(),
  });
};

export const useConnectedIntegrations = () => {
  return useQuery<Integration[], Error>({
    queryKey: ['connected-integrations'],
    queryFn: () => integrationService.getConnectedIntegrations(),
  });
};

export const useDisconnectedIntegrations = () => {
  return useQuery<Integration[], Error>({
    queryKey: ['disconnected-integrations'],
    queryFn: () => integrationService.getDisconnectedIntegrations(),
  });
};

export const useConnectIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => integrationService.connectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['connected-integrations'] });
      queryClient.invalidateQueries({ queryKey: ['disconnected-integrations'] });
    },
  });
};

export const useDisconnectIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => integrationService.disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['connected-integrations'] });
      queryClient.invalidateQueries({ queryKey: ['disconnected-integrations'] });
    },
  });
};