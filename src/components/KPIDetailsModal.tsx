
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface KPIDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: {
    id: string;
    category: string;
    description: string;
    target: number;
    current: number;
    score: number;
    department: string;
    lastUpdated: string;
  } | null;
}

const KPIDetailsModal = ({ isOpen, onClose, kpi }: KPIDetailsModalProps) => {
  if (!kpi) return null;

  const getPerformanceLevel = (score: number) => {
    if (score >= 81) return { label: 'Outstanding', color: 'bg-green-100 text-green-800' };
    if (score >= 61) return { label: 'Above Average', color: 'bg-blue-100 text-blue-800' };
    if (score >= 41) return { label: 'Meets Expectations', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 21) return { label: 'Below Average', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Poor Performance', color: 'bg-red-100 text-red-800' };
  };

  const performance = getPerformanceLevel(kpi.score);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            KPI Details - {kpi.category}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-lg font-semibold text-gray-900">{kpi.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-lg text-gray-900">{new Date(kpi.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900 mt-1">{kpi.description}</p>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{kpi.current}</div>
                <div className="text-sm text-gray-500">Current Value</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{kpi.target}</div>
                <div className="text-sm text-gray-500">Target Value</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{kpi.score}%</div>
                <div className="text-sm text-gray-500">Achievement Score</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Progress to Target</span>
              <span className="text-sm font-medium text-gray-900">{kpi.score}%</span>
            </div>
            <Progress value={kpi.score} className="h-3" />
          </div>

          {/* Performance Level */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-500">Performance Level:</span>
            <Badge className={`${performance.color} border-0 text-sm font-medium`}>
              {performance.label}
            </Badge>
          </div>

          {/* Performance Scale Reference */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Performance Scale:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• 0-20%: Poor Performance</div>
              <div>• 21-40%: Below Average</div>
              <div>• 41-60%: Meets Expectations</div>
              <div>• 61-80%: Above Average</div>
              <div>• 81-100%: Outstanding</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDetailsModal;
