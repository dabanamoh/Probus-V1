import { useState, useEffect, useCallback } from 'react';
import { localDb } from '@/integrations/local-db';
import type { Tables } from '@/integrations/local-db/types';

type Message = Tables<'messages'>;

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const { data, error } = await localDb
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    // Set up real-time subscription
    // Note: Local database implementation may not support real-time subscriptions
    // We'll need to implement a polling mechanism or use a different approach
  }, [conversationId, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    try {
      const { error } = await localDb
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_name: 'You',
          sender_initials: 'YO',
          message: content,
          is_own: true,
        });

      if (error) throw error;

      // Refresh messages after sending
      fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
};