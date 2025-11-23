import React from 'react';
import { Card, CardContent } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  type: 'risk' | 'prediction' | 'compliance' | 'incident';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  onClick: () => void;
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon,
  description,
  type,
  severity,
  onClick,
  className
}) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'risk': return 'text-red-600';
      case 'prediction': return 'text-blue-600';
      case 'compliance': return 'text-purple-600';
      case 'incident': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'risk': return 'bg-red-50';
      case 'prediction': return 'bg-blue-50';
      case 'compliance': return 'bg-purple-50';
      case 'incident': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  const getTypeBorder = (type: string) => {
    switch (type) {
      case 'risk': return 'border-l-4 border-l-red-500';
      case 'prediction': return 'border-l-4 border-l-blue-500';
      case 'compliance': return 'border-l-4 border-l-purple-500';
      case 'incident': return 'border-l-4 border-l-orange-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg bg-white",
        getTypeBorder(type),
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getTypeColor(type), getTypeBgColor(type))}>
            {icon}
          </div>
          {severity && (
            <Badge className={getSeverityColor(severity)}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={cn("text-2xl font-bold", getTypeColor(type))}>{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
