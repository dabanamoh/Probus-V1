
-- Create incidents table to store incident reports
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.employees(id) NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  incident_type TEXT NOT NULL DEFAULT 'whistleblowing',
  description TEXT NOT NULL,
  date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'invalid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards_punishments table to track employee rewards and punishments
CREATE TABLE public.rewards_punishments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  incident_id UUID REFERENCES public.incidents(id),
  type TEXT NOT NULL CHECK (type IN ('reward', 'punishment')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2),
  date_awarded DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  awarded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for incidents table
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on incidents"
  ON public.incidents
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add RLS policies for rewards_punishments table  
ALTER TABLE public.rewards_punishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on rewards_punishments"
  ON public.rewards_punishments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Insert some sample data for incidents
INSERT INTO public.incidents (reporter_id, department_id, incident_type, description, location, status) 
SELECT 
  e.id,
  e.department_id,
  'whistleblowing',
  'There is a significant water leak in the office kitchen area. There is a significant water leak in the office kitchen area significant water leak in the office kitchen area.',
  'Accra - Ghana',
  CASE 
    WHEN random() < 0.3 THEN 'pending'
    WHEN random() < 0.7 THEN 'resolved' 
    ELSE 'invalid'
  END
FROM public.employees e
WHERE e.name IS NOT NULL
LIMIT 10;

-- Insert some sample rewards data
INSERT INTO public.rewards_punishments (employee_id, incident_id, type, category, description, amount, status, awarded_by)
SELECT 
  i.reporter_id,
  i.id,
  'reward',
  'Whistleblowing Recognition',
  'Recognition for reporting fraudulent activities and maintaining integrity',
  CASE 
    WHEN random() < 0.5 THEN 500.00
    ELSE 1000.00
  END,
  CASE 
    WHEN random() < 0.3 THEN 'pending'
    WHEN random() < 0.8 THEN 'approved'
    ELSE 'rejected'
  END,
  'Management'
FROM public.incidents i
WHERE i.status = 'resolved'
LIMIT 5;
