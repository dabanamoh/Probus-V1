
-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_initials TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  file_name TEXT,
  file_size TEXT,
  is_own BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations (public access for demo)
CREATE POLICY "Anyone can view conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Anyone can create conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update conversations" ON public.conversations FOR UPDATE USING (true);

-- Create policies for messages (public access for demo)
CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update messages" ON public.messages FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete messages" ON public.messages FOR DELETE USING (true);

-- Insert some sample conversations
INSERT INTO public.conversations (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Olatunde Adeyemi Tuga'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Team Design'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Adebayo Isaac'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Henry Amusah');

-- Insert some sample messages
INSERT INTO public.messages (conversation_id, sender_name, sender_initials, message, is_own) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'SJ', 'Hey! How are you doing today?', false),
  ('550e8400-e29b-41d4-a716-446655440001', 'You', 'YO', 'I''m doing great, thanks for asking! How about you?', true),
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'SJ', 'Spark 40 OOH kv Extension SAMPLE.cdr', false),
  ('550e8400-e29b-41d4-a716-446655440001', 'You', 'YO', 'Thanks for sharing that file! I''ll review it shortly.', true);

-- Update the file message to be a file type
UPDATE public.messages 
SET message_type = 'file', file_name = 'Spark 40 OOH kv Extension SAMPLE.cdr', file_size = '585.0 MB'
WHERE message = 'Spark 40 OOH kv Extension SAMPLE.cdr';

-- Enable realtime for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
