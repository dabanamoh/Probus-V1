
-- Create resignations_terminations table
CREATE TABLE public.resignations_terminations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('resignation', 'termination')),
  years_of_service INTEGER NOT NULL DEFAULT 0,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add some sample data to match the design
INSERT INTO public.resignations_terminations (employee_id, request_type, years_of_service, request_date, status) 
SELECT 
  e.id,
  CASE 
    WHEN random() > 0.5 THEN 'resignation'
    ELSE 'termination'
  END,
  FLOOR(random() * 10 + 1)::INTEGER,
  '2023-09-15'::DATE,
  CASE 
    WHEN random() > 0.6 THEN 'pending'
    WHEN random() > 0.3 THEN 'accepted'
    ELSE 'rejected'
  END
FROM public.employees e
LIMIT 20;
