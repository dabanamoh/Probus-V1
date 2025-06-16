
-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  department_id UUID REFERENCES public.departments(id),
  level TEXT,
  qualification TEXT,
  certifications TEXT,
  date_of_birth DATE,
  job_description TEXT,
  date_of_resumption DATE,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for department manager
ALTER TABLE public.departments 
ADD CONSTRAINT fk_departments_manager 
FOREIGN KEY (manager_id) REFERENCES public.employees(id);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for departments (public access for now)
CREATE POLICY "Allow all operations on departments" 
  ON public.departments 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create policies for employees (public access for now)
CREATE POLICY "Allow all operations on employees" 
  ON public.employees 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Insert sample data
INSERT INTO public.departments (id, name, description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Finance/Accounts Department', 'Manages financial operations and accounting');

INSERT INTO public.employees (id, name, position, department_id, level, qualification, certifications, date_of_birth, job_description, date_of_resumption, profile_image_url) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Andrea Rodrigoz', 'Accounts Receivable Specialist', '550e8400-e29b-41d4-a716-446655440000', 'L9', 'University Graduate', 'AACAA, Microsoft Office', '1993-02-15', 'Manages outgoing payments to suppliers and vendors, processes invoices, and ensures timely payment while maintaining accurate records of transactions.', '2017-08-01', '/lovable-uploads/b884829c-0ad4-4bb1-95d1-ce0c68af9694.png');

-- Update department manager
UPDATE public.departments 
SET manager_id = '550e8400-e29b-41d4-a716-446655440001' 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
