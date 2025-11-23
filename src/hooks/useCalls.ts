import { useState, useEffect } from 'react';
import { localDb } from '@/integrations/local-db';
import { useToast } from "@/hooks/use-toast";
import { TablesInsert } from '@/integrations/local-db/types';

export interface Call {
  id: string;
  group_id: string;
  caller_id: string;
  callee_id: string;
  type: 'voice' | 'video';
  status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'missed' | 'declined';
  start_time?: string;
  end_time?: string;
  duration?: number; // in seconds
  created_at: string;
}

export const useCalls = (groupId?: string) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch calls for a group
  useEffect(() => {
    const fetchCalls = async () => {
      if (!groupId) return;

      setLoading(true);
      try {
        const { data, error } = await localDb
          .from('calls')
          .select('*')
          .eq('group_id', groupId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCalls(data || []);
      } catch (error) {
        console.error('Error fetching calls:', error);
        toast({
          title: "Error",
          description: "Failed to load calls",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [groupId, toast]);

  // Initiate a call
  const initiateCall = async (calleeId: string, type: 'voice' | 'video') => {
    if (!groupId) return;

    try {
      const newCall: TablesInsert<'calls'> = {
        group_id: groupId,
        caller_id: 'current-user', // In a real app, this would be the actual user ID
        callee_id: calleeId,
        type,
        status: 'initiated',
        created_at: new Date().toISOString()
      };

      const { data, error } = await localDb
        .from('calls')
        .insert(newCall);

      if (error) throw error;

      // In a real implementation, this would connect to a WebRTC service
      toast({
        title: "Call Initiated",
        description: `${type === 'video' ? 'Video' : 'Voice'} call started`
      });

      return data?.[0];
    } catch (error) {
      console.error('Error initiating call:', error);
      toast({
        title: "Error",
        description: "Failed to initiate call",
        variant: "destructive"
      });
    }
  };

  // End a call
  const endCall = async (callId: string) => {
    try {
      const endTime = new Date().toISOString();

      const { error } = await localDb
        .from('calls')
        .eq('id', callId)
        .update({
          status: 'completed',
          end_time: endTime
        });

      if (error) throw error;

      // Update local state
      setCalls(prev => prev.map(call =>
        call.id === callId
          ? { ...call, status: 'completed', end_time: endTime }
          : call
      ));

      toast({
        title: "Call Ended",
        description: "Call has been completed"
      });
    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: "Error",
        description: "Failed to end call",
        variant: "destructive"
      });
    }
  };

  return {
    calls,
    loading,
    initiateCall,
    endCall
  };
};