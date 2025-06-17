
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, History } from 'lucide-react';

interface HistoryTableProps {
  data: any[];
  type: 'risk' | 'prediction' | 'compliance' | 'incident';
  onViewDetails: (item: any) => void;
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
            <TableHead>Risk Level</TableHead>
            <TableHead>Assessment Type</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </>
        );
      case 'prediction':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </>
        );
      case 'compliance':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Issues</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </>
        );
      case 'incident':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </>
        );
    }
  };

  const renderTableRow = (item: any, index: number) => {
    switch (type) {
      case 'risk':
        return (
          <TableRow key={index}>
            <TableCell>
              <Badge className={getSeverityColor(item.risk_level)}>
                {item.risk_level?.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{item.assessment_type}</TableCell>
            <TableCell>{item.employee_name || 'N/A'}</TableCell>
            <TableCell>{(item.confidence_score * 100).toFixed(1)}%</TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <History className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      case 'prediction':
        return (
          <TableRow key={index}>
            <TableCell>{item.prediction_type}</TableCell>
            <TableCell>{item.employee_name || 'N/A'}</TableCell>
            <TableCell>{(item.confidence_score * 100).toFixed(1)}%</TableCell>
            <TableCell>
              <Badge variant={item.outcome === 'accurate' ? 'default' : 'secondary'}>
                {item.outcome || 'Pending'}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <History className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      case 'compliance':
        return (
          <TableRow key={index}>
            <TableCell>{item.compliance_type}</TableCell>
            <TableCell>{item.score}%</TableCell>
            <TableCell>{item.issues_found}</TableCell>
            <TableCell>
              <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <History className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
      case 'incident':
        return (
          <TableRow key={index}>
            <TableCell>{item.incident_type}</TableCell>
            <TableCell>
              <Badge className={getSeverityColor(item.severity)}>
                {item.severity?.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{item.employee_name || 'N/A'}</TableCell>
            <TableCell>
              <Badge variant={item.resolution_status === 'resolved' ? 'default' : 'secondary'}>
                {item.resolution_status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                <History className="w-3 h-3 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
