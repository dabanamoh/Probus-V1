
-- Create holidays table
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for holidays
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Create policy for holidays (public read access for employees)
CREATE POLICY "Allow all operations on holidays" 
  ON public.holidays 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Insert some sample holidays
INSERT INTO public.holidays (name, date, description, is_recurring) VALUES 
('New Year''s Day', '2024-01-01', 'Start of the new year', true),
('Independence Day', '2024-03-06', 'Ghana Independence Day', true),
('Good Friday', '2024-03-29', 'Christian holiday', true),
('Easter Monday', '2024-04-01', 'Christian holiday', true),
('May Day', '2024-05-01', 'International Workers'' Day', true),
('Christmas Day', '2024-12-25', 'Christian holiday celebrating the birth of Jesus', true),
('Boxing Day', '2024-12-26', 'Day after Christmas', true);
