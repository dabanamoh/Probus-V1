
-- Create user roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee', 'hr');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'employee',
  department_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create permissions table
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create role permissions mapping table
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role public.app_role NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Create application settings table
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS Policies for admin-only access
CREATE POLICY "Only admins can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage permissions" 
  ON public.permissions 
  FOR ALL 
  USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage role permissions" 
  ON public.role_permissions 
  FOR ALL 
  USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage app settings" 
  ON public.app_settings 
  FOR ALL 
  USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES 
('kpi_approvals', 'Approve KPI submissions and reviews', 'KPI Management'),
('leave_approvals', 'Approve leave requests', 'Leave Management'),
('employee_management', 'Add, edit, and manage employee records', 'Employee Management'),
('department_management', 'Create and manage departments', 'Department Management'),
('resignation_approvals', 'Approve resignation and termination requests', 'HR Management'),
('reward_management', 'Create and manage rewards and punishments', 'HR Management'),
('feedback_management', 'View and manage employee feedback', 'Feedback Management'),
('notice_management', 'Create and manage company notices', 'Notice Management'),
('event_management', 'Manage company events and holidays', 'Event Management'),
('settings_access', 'Access application settings', 'System Settings'),
('reports_access', 'Access and generate reports', 'Reports'),
('payroll_access', 'Access payroll information', 'Finance');

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'admin', id FROM public.permissions;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'manager', id FROM public.permissions 
WHERE name IN ('kpi_approvals', 'leave_approvals', 'feedback_management', 'reports_access');

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'hr', id FROM public.permissions 
WHERE name IN ('employee_management', 'resignation_approvals', 'reward_management', 'payroll_access');

-- Insert default app settings
INSERT INTO public.app_settings (setting_key, setting_value, category, description) VALUES 
('theme_colors', '{"primary": "#3b82f6", "secondary": "#64748b", "accent": "#10b981", "background": "#ffffff", "foreground": "#0f172a"}', 'Appearance', 'Application theme colors'),
('company_logo', '{"url": "", "alt": "Company Logo"}', 'Appearance', 'Company logo settings'),
('company_info', '{"name": "IntegrityMerit", "tagline": "Empowering Excellence, Rewarding Integrity", "address": "", "phone": "", "email": ""}', 'Company', 'Basic company information'),
('notification_settings', '{"email_notifications": true, "push_notifications": true, "sms_notifications": false}', 'Notifications', 'Global notification preferences'),
('security_settings', '{"password_min_length": 8, "require_2fa": false, "session_timeout": 480}', 'Security', 'Application security settings');
