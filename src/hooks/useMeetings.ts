import { useState, useEffect } from 'react';
import { localDb } from '@/integrations/local-db';
import { useToast } from "@/hooks/use-toast";
import { TablesInsert } from '@/integrations/local-db/types';

export interface Meeting {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  organizer_id: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string;
  status: 'invited' | 'accepted' | 'declined' | 'tentative';
  joined_at?: string;
  left_at?: string;
}

export const useMeetings = (groupId?: string) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch meetings for a group
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!groupId) return;

      setLoading(true);
      try {
        const { data, error } = await localDb
          .from('meetings')
          .select('*')
          .eq('group_id', groupId)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setMeetings(data || []);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        toast({
          title: "Error",
          description: "Failed to load meetings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [groupId, toast]);

  // Schedule a new meeting
  const scheduleMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMeeting: TablesInsert<'meetings'> = {
        ...meetingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await localDb
        .from('meetings')
        .insert(newMeeting);

      if (error) throw error;

      // Update local state
      if (data?.[0]) {
        setMeetings(prev => [...prev, data[0]]);
      }

      toast({
        title: "Meeting Scheduled",
        description: "Your meeting has been scheduled successfully"
      });

      return data?.[0];
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive"
      });
    }
  };

  // Update meeting status
  const updateMeetingStatus = async (meetingId: string, status: Meeting['status']) => {
    try {
      const { error } = await localDb
        .from('meetings')
        .eq('id', meetingId)
        .update({
          status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setMeetings(prev => prev.map(meeting =>
        meeting.id === meetingId
          ? { ...meeting, status, updated_at: new Date().toISOString() }
          : meeting
      ));

      toast({
        title: "Meeting Updated",
        description: `Meeting status updated to ${status}`
      });
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive"
      });
    }
  };

  // Cancel a meeting
  const cancelMeeting = async (meetingId: string) => {
    return updateMeetingStatus(meetingId, 'cancelled');
  };

  return {
    meetings,
    loading,
    scheduleMeeting,
    updateMeetingStatus,
    cancelMeeting
  };
};