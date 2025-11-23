import { Json } from '@/integrations/local-db/types';

export interface RiskAssessment {
    id: string;
    created_at: string;
    updated_at?: string;
    employee_name?: string;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    assessment_type: string;
    confidence_score: number;
    analysis_data?: Json;
}

export interface Prediction {
    id: string;
    created_at: string;
    updated_at?: string;
    employee_name?: string;
    prediction_type: string;
    confidence_score: number;
    outcome?: string;
    prediction_data?: Json;
}

export interface ComplianceRecord {
    id: string;
    created_at: string;
    updated_at?: string;
    compliance_type: string;
    score: number;
    issues_found: number;
    status: 'resolved' | 'pending' | 'failed';
    actions_required?: string[];
}

export interface Incident {
    id: string;
    created_at: string;
    updated_at?: string;
    employee_name?: string;
    incident_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    resolution_status: 'resolved' | 'pending' | 'open';
    ai_analysis?: Json;
}

export type AIDashboardItem = RiskAssessment | Prediction | ComplianceRecord | Incident;
