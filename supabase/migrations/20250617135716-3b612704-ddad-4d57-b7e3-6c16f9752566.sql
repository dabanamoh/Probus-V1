
-- Create tables for AI analytics history
CREATE TABLE public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type TEXT NOT NULL, -- 'risk_assessment', 'performance_prediction', 'compliance_check'
  employee_id UUID REFERENCES public.employees(id),
  department_id UUID REFERENCES public.departments(id),
  prediction_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  outcome TEXT, -- 'accurate', 'inaccurate', 'pending'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create table for compliance history
CREATE TABLE public.compliance_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  compliance_type TEXT NOT NULL, -- 'gdpr', 'data_retention', 'access_control'
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  issues_found INTEGER DEFAULT 0,
  actions_required TEXT[],
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'resolved', 'pending'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create table for risk incidents history
CREATE TABLE public.risk_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL, -- 'behavioral', 'security', 'compliance', 'performance'
  severity risk_level NOT NULL,
  employee_id UUID REFERENCES public.employees(id),
  department_id UUID REFERENCES public.departments(id),
  description TEXT NOT NULL,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  resolution_status TEXT NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin and HR access)
CREATE POLICY "Admins and HR can view AI predictions"
  ON public.ai_predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Admins and HR can view compliance history"
  ON public.compliance_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Admins and HR can view risk incidents"
  ON public.risk_incidents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_ai_predictions_created_at ON public.ai_predictions(created_at DESC);
CREATE INDEX idx_compliance_history_created_at ON public.compliance_history(created_at DESC);
CREATE INDEX idx_risk_incidents_created_at ON public.risk_incidents(created_at DESC);
CREATE INDEX idx_risk_incidents_employee_id ON public.risk_incidents(employee_id);

-- Add triggers for updated_at
CREATE TRIGGER update_risk_incidents_updated_at 
  BEFORE UPDATE ON public.risk_incidents 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample historical data
INSERT INTO public.ai_predictions (prediction_type, employee_id, prediction_data, confidence_score, outcome) VALUES
('risk_assessment', (SELECT id FROM public.employees LIMIT 1), '{"predicted_risk": "medium", "factors": ["workload", "communication"]}', 0.78, 'pending'),
('performance_prediction', (SELECT id FROM public.employees LIMIT 1), '{"predicted_performance": 8.5, "trend": "improving"}', 0.85, 'accurate'),
('compliance_check', NULL, '{"areas_checked": ["data_access", "retention"], "status": "compliant"}', 0.92, 'accurate');

INSERT INTO public.compliance_history (compliance_type, score, details, issues_found, actions_required) VALUES
('gdpr', 94.5, '{"data_processing": "compliant", "retention": "compliant", "access_controls": "needs_review"}', 1, ARRAY['Review access control policies']),
('data_retention', 98.2, '{"auto_deletion": "active", "manual_review": "scheduled"}', 0, ARRAY[]::TEXT[]),
('access_control', 89.7, '{"user_permissions": "reviewed", "admin_access": "compliant"}', 2, ARRAY['Update user permissions', 'Review admin access logs']);

INSERT INTO public.risk_incidents (incident_type, severity, employee_id, description, ai_analysis, resolution_status) VALUES
('behavioral', 'high', (SELECT id FROM public.employees LIMIT 1), 'Unusual communication pattern detected in team chat', '{"confidence": 0.82, "indicators": ["aggressive_language", "after_hours_activity"]}', 'investigating'),
('compliance', 'medium', NULL, 'Data access outside normal business hours', '{"confidence": 0.75, "risk_factors": ["time_of_access", "data_sensitivity"]}', 'resolved'),
('performance', 'low', (SELECT id FROM public.employees LIMIT 1), 'Performance metrics trending downward', '{"confidence": 0.68, "metrics": ["productivity", "quality_score"]}', 'open');
