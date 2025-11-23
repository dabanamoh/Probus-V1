import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui/table";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { Calendar, History, Eye } from 'lucide-react';
import { AIDashboardItem, RiskAssessment, Prediction, ComplianceRecord, Incident } from '@/types/ai';

interface HistoryTableProps {
  data: AIDashboardItem[];
  type: 'risk' | 'prediction' | 'compliance' | 'incident';
  onViewDetails: (item: AIDashboardItem) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data, type, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  const renderTableHeaders = () => {
    switch (type) {
      case 'risk':
        return (
          <>
            <TableHead className="font-semibold text-gray-700">Risk Level</TableHead>
            <TableHead className="font-semibold text-gray-700">Assessment Type</TableHead>
            <TableHead className="font-semibold text-gray-700">Employee</TableHead>
            <TableHead className="font-semibold text-gray-700">Confidence</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
          </>
        );
      case 'prediction':
        return (
          <>
            <TableHead className="font-semibold text-gray-700">Type</TableHead>
            <TableHead className="font-semibold text-gray-700">Employee</TableHead>
            <TableHead className="font-semibold text-gray-700">Confidence</TableHead>
            <TableHead className="font-semibold text-gray-700">Outcome</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
          </>
        );
      case 'compliance':
        return (
          <>
            <TableHead className="font-semibold text-gray-700">Type</TableHead>
            <TableHead className="font-semibold text-gray-700">Score</TableHead>
            <TableHead className="font-semibold text-gray-700">Issues</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
          </>
        );
      case 'incident':
        return (
          <>
            <TableHead className="font-semibold text-gray-700">Type</TableHead>
            <TableHead className="font-semibold text-gray-700">Severity</TableHead>
            <TableHead className="font-semibold text-gray-700">Employee</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
          </>
        );
    }
  };

  const renderTableRow = (item: AIDashboardItem, index: number) => {
    switch (type) {
      case 'risk': {
        const riskItem = item as RiskAssessment;
        return (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell>
              <Badge className={getSeverityColor(riskItem.risk_level)}>
                {riskItem.risk_level?.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{riskItem.assessment_type}</TableCell>
            <TableCell>{riskItem.employee_name || 'N/A'}</TableCell>
            <TableCell>{(riskItem.confidence_score * 100).toFixed(1)}%</TableCell>
            <TableCell>{formatDate(riskItem.created_at)}</TableCell>
            <TableCell className="text-center">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      }
      case 'prediction': {
        const predItem = item as Prediction;
        return (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{predItem.prediction_type}</TableCell>
            <TableCell>{predItem.employee_name || 'N/A'}</TableCell>
            <TableCell>{(predItem.confidence_score * 100).toFixed(1)}%</TableCell>
            <TableCell>
              <Badge variant={predItem.outcome === 'accurate' ? 'default' : 'secondary'}>
                {predItem.outcome || 'Pending'}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(predItem.created_at)}</TableCell>
            <TableCell className="text-center">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      }
      case 'compliance': {
        const compItem = item as ComplianceRecord;
        return (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{compItem.compliance_type}</TableCell>
            <TableCell>{compItem.score}%</TableCell>
            <TableCell>{compItem.issues_found}</TableCell>
            <TableCell>
              <Badge variant={compItem.status === 'resolved' ? 'default' : 'secondary'}>
                {compItem.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(compItem.created_at)}</TableCell>
            <TableCell className="text-center">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      }
      case 'incident': {
        const incItem = item as Incident;
        return (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{incItem.incident_type}</TableCell>
            <TableCell>
              <Badge className={getSeverityColor(incItem.severity)}>
                {incItem.severity?.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{incItem.employee_name || 'N/A'}</TableCell>
            <TableCell>
              <Badge variant={incItem.resolution_status === 'resolved' ? 'default' : 'secondary'}>
                {incItem.resolution_status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(incItem.created_at)}</TableCell>
            <TableCell className="text-center">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      }
    }
  };

  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {renderTableHeaders()}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No historical data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => renderTableRow(item, index))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoryTable;
