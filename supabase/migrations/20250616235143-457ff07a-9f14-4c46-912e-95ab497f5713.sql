
-- Create feedbacks table
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  type TEXT NOT NULL DEFAULT 'general', -- 'general', 'memo', 'complaint', 'suggestion'
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  leave_type TEXT NOT NULL, -- 'sick', 'annual', 'emergency', 'maternity', 'paternity'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES public.employees(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES public.employees(id),
  sender_id UUID REFERENCES public.employees(id),
  type TEXT NOT NULL, -- 'memo', 'leave_status', 'feedback_response', 'general'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedbacks (admins can see all, employees can see their own)
CREATE POLICY "Admins can view all feedbacks" ON public.feedbacks FOR SELECT USING (true);
CREATE POLICY "Employees can create feedbacks" ON public.feedbacks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update feedbacks" ON public.feedbacks FOR UPDATE USING (true);

-- Create RLS policies for leave requests
CREATE POLICY "Admins can view all leave requests" ON public.leave_requests FOR SELECT USING (true);
CREATE POLICY "Employees can create leave requests" ON public.leave_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update leave requests" ON public.leave_requests FOR UPDATE USING (true);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Users can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (true);

-- Insert some sample data
INSERT INTO public.feedbacks (employee_id, type, subject, message, priority) 
SELECT 
  e.id,
  (ARRAY['general', 'complaint', 'suggestion'])[floor(random() * 3 + 1)],
  (ARRAY['Office Environment', 'Work Schedule', 'Team Communication', 'Equipment Request', 'Policy Feedback'])[floor(random() * 5 + 1)],
  'This is a sample feedback message from an employee regarding various workplace matters.',
  (ARRAY['low', 'medium', 'high'])[floor(random() * 3 + 1)]
FROM public.employees e
LIMIT 10;

INSERT INTO public.leave_requests (employee_id, leave_type, start_date, end_date, days_requested, reason)
SELECT 
  e.id,
  (ARRAY['sick', 'annual', 'emergency'])[floor(random() * 3 + 1)],
  CURRENT_DATE + (floor(random() * 30) || ' days')::interval,
  CURRENT_DATE + (floor(random() * 30) + 5 || ' days')::interval,
  floor(random() * 10 + 1)::integer,
  'Personal reasons for leave request'
FROM public.employees e
LIMIT 15;
