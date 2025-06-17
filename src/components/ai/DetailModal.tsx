
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
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

  const renderRiskDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-2">Employee</h4>
        <p className="text-sm text-gray-600">{data.employee_name || 'N/A'}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Risk Level</h4>
        <Badge className={getSeverityColor(data.risk_level)}>
          {data.risk_level?.toUpperCase()}
        </Badge>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Assessment Type</h4>
        <p className="text-sm text-gray-600">{data.assessment_type}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Confidence Score</h4>
        <p className="text-sm text-gray-600">{(data.confidence_score * 100).toFixed(1)}%</p>
      </div>
      {data.analysis_data && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Analysis Details</h4>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(data.analysis_data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  const renderPredictionDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-2">Prediction Type</h4>
        <p className="text-sm text-gray-600">{data.prediction_type}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Confidence Score</h4>
        <p className="text-sm text-gray-600">{(data.confidence_score * 100).toFixed(1)}%</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Outcome</h4>
        <Badge variant={data.outcome === 'accurate' ? 'default' : 'secondary'}>
          {data.outcome || 'Pending'}
        </Badge>
      </div>
      {data.prediction_data && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Prediction Data</h4>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(data.prediction_data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  const renderComplianceDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-2">Compliance Type</h4>
        <p className="text-sm text-gray-600">{data.compliance_type}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Score</h4>
        <p className="text-sm text-gray-600">{data.score}%</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Issues Found</h4>
        <p className="text-sm text-gray-600">{data.issues_found}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Status</h4>
        <Badge variant={data.status === 'resolved' ? 'default' : 'secondary'}>
          {data.status}
        </Badge>
      </div>
      {data.actions_required && data.actions_required.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Actions Required</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {data.actions_required.map((action: string, index: number) => (
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

  const renderIncidentDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-2">Incident Type</h4>
        <p className="text-sm text-gray-600">{data.incident_type}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Severity</h4>
        <Badge className={getSeverityColor(data.severity)}>
          {data.severity?.toUpperCase()}
        </Badge>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Description</h4>
        <p className="text-sm text-gray-600">{data.description}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Resolution Status</h4>
        <Badge variant={data.resolution_status === 'resolved' ? 'default' : 'secondary'}>
          {data.resolution_status}
        </Badge>
      </div>
      {data.ai_analysis && (
        <div>
          <h4 className="font-semibold text-sm mb-2">AI Analysis</h4>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(data.ai_analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

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
