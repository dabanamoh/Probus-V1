
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/dialog";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { Separator } from "../../../shared/ui/separator";
import { ScrollArea } from "../../../shared/ui/scroll-area";
import { Calendar, Clock } from 'lucide-react';
import { AIDashboardItem, RiskAssessment, Prediction, ComplianceRecord, Incident } from '@/types/ai';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AIDashboardItem | null;
  type: 'risk' | 'prediction' | 'compliance' | 'incident';
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  data,
  type
}) => {
  if (!data) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const renderRiskDetails = () => {
    const item = data as RiskAssessment;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Employee</h4>
          <p className="text-sm text-gray-600">{item.employee_name || 'N/A'}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Risk Level</h4>
          <Badge className={getSeverityColor(item.risk_level)}>
            {item.risk_level?.toUpperCase()}
          </Badge>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Assessment Type</h4>
          <p className="text-sm text-gray-600">{item.assessment_type}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Confidence Score</h4>
          <p className="text-sm text-gray-600">{(item.confidence_score * 100).toFixed(1)}%</p>
        </div>
        {item.analysis_data && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Analysis Details</h4>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(item.analysis_data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderPredictionDetails = () => {
    const item = data as Prediction;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Prediction Type</h4>
          <p className="text-sm text-gray-600">{item.prediction_type}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Confidence Score</h4>
          <p className="text-sm text-gray-600">{(item.confidence_score * 100).toFixed(1)}%</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Outcome</h4>
          <Badge variant={item.outcome === 'accurate' ? 'default' : 'secondary'}>
            {item.outcome || 'Pending'}
          </Badge>
        </div>
        {item.prediction_data && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Prediction Data</h4>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(item.prediction_data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderComplianceDetails = () => {
    const item = data as ComplianceRecord;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Compliance Type</h4>
          <p className="text-sm text-gray-600">{item.compliance_type}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Score</h4>
          <p className="text-sm text-gray-600">{item.score}%</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Issues Found</h4>
          <p className="text-sm text-gray-600">{item.issues_found}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Status</h4>
          <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        </div>
        {item.actions_required && item.actions_required.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Actions Required</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {item.actions_required.map((action: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderIncidentDetails = () => {
    const item = data as Incident;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Incident Type</h4>
          <p className="text-sm text-gray-600">{item.incident_type}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Severity</h4>
          <Badge className={getSeverityColor(item.severity)}>
            {item.severity?.toUpperCase()}
          </Badge>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Description</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Resolution Status</h4>
          <Badge variant={item.resolution_status === 'resolved' ? 'default' : 'secondary'}>
            {item.resolution_status}
          </Badge>
        </div>
        {item.ai_analysis && (
          <div>
            <h4 className="font-semibold text-sm mb-2">AI Analysis</h4>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(item.ai_analysis, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'risk': return renderRiskDetails();
      case 'prediction': return renderPredictionDetails();
      case 'compliance': return renderComplianceDetails();
      case 'incident': return renderIncidentDetails();
      default: return <p>No details available</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type.charAt(0).toUpperCase() + type.slice(1)} Details
            <Badge variant="outline">{data.id?.slice(0, 8)}...</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created: {formatDate(data.created_at)}
              </div>
              {data.updated_at && data.updated_at !== data.created_at && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Updated: {formatDate(data.updated_at)}
                </div>
              )}
            </div>

            <Separator />

            {renderContent()}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
