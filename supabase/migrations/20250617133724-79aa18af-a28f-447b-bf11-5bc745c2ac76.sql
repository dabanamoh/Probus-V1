
-- Create enum types for AI features
CREATE TYPE public.chat_type AS ENUM ('direct', 'group', 'department');
CREATE TYPE public.message_type AS ENUM ('text', 'file', 'system');
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.ai_analysis_type AS ENUM ('performance', 'behavioral', 'compliance', 'fraud', 'harassment');
CREATE TYPE public.file_access_level AS ENUM ('public', 'department', 'private', 'restricted');

-- Chat Groups/Rooms table
CREATE TABLE public.chat_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type chat_type NOT NULL DEFAULT 'group',
  department_id UUID REFERENCES public.departments(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat Group Members
CREATE TABLE public.chat_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.chat_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_admin BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(group_id, user_id)
);

-- Chat Messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.chat_groups(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  message_type message_type NOT NULL DEFAULT 'text',
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  reply_to_id UUID REFERENCES public.chat_messages(id),
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- AI Risk Assessment table
CREATE TABLE public.ai_risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  assessment_type ai_analysis_type NOT NULL,
  risk_level risk_level NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  analysis_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendations TEXT[],
  requires_action BOOLEAN NOT NULL DEFAULT false,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- AI Analytics Dashboard Data
CREATE TABLE public.ai_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL, -- 'department', 'employee', 'company'
  entity_id UUID, -- department_id or employee_id
  metric_value DECIMAL,
  metric_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Company Policies for AI guidance
CREATE TABLE public.company_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- GDPR Compliance tracking
CREATE TABLE public.data_processing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL, -- 'access', 'modify', 'delete', 'export'
  data_category TEXT NOT NULL, -- 'personal', 'performance', 'communication'
  purpose TEXT NOT NULL,
  legal_basis TEXT NOT NULL, -- 'consent', 'contract', 'legal_obligation', 'legitimate_interest'
  processor_id UUID REFERENCES auth.users(id),
  retention_period INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Chat Groups
CREATE POLICY "Users can view chat groups they are members of"
  ON public.chat_groups FOR SELECT
  USING (
    id IN (
      SELECT group_id FROM public.chat_group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat groups"
  ON public.chat_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for Chat Messages
CREATE POLICY "Users can view messages in their groups"
  ON public.chat_messages FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM public.chat_group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their groups"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    group_id IN (
      SELECT group_id FROM public.chat_group_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for AI Risk Assessments (Admin and HR only)
CREATE POLICY "Admins and HR can view risk assessments"
  ON public.ai_risk_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr')
    )
  );

-- RLS Policies for Company Policies (Everyone can read)
CREATE POLICY "All authenticated users can view active policies"
  ON public.company_policies FOR SELECT
  USING (is_active = true);

-- RLS Policies for Data Processing Logs (Admin only)
CREATE POLICY "Admins can view data processing logs"
  ON public.data_processing_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_chat_messages_group_id ON public.chat_messages(group_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_ai_risk_assessments_employee_id ON public.ai_risk_assessments(employee_id);
CREATE INDEX idx_ai_analytics_entity_period ON public.ai_analytics(entity_id, period_start, period_end);
CREATE INDEX idx_data_processing_logs_user_id ON public.data_processing_logs(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_chat_groups_updated_at 
  BEFORE UPDATE ON public.chat_groups 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_policies_updated_at 
  BEFORE UPDATE ON public.company_policies 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
