import React from 'react';
import { Shield, FileText, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/card";
import PolicyEditor from '../../shared/components/policy/PolicyEditor';

const PolicyManagement = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 bg-blue-50/30 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Policies & Compliance</h1>
        <p className="text-blue-700">Manage company policies, compliance requirements, and documentation</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 text-sm">HR Policy Access</h3>
                <p className="text-xs text-blue-700 mt-1">
                  HR can create and edit policy drafts. Only Admin can publish policies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-100 rounded-lg border border-sky-200">
                <Shield className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sky-900 text-sm">Compliance Tracking</h3>
                <p className="text-xs text-sky-700 mt-1">
                  Monitor employee acknowledgments and policy compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                <AlertTriangle className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-indigo-900 text-sm">Review Workflow</h3>
                <p className="text-xs text-indigo-700 mt-1">
                  Submit drafts for admin review before publication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Policy Editor */}
      <Card className="border border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="w-5 h-5 text-blue-600" />
            Policy Document Management
          </CardTitle>
          <CardDescription className="text-blue-700">
            Create and manage company policy documents. Your drafts will be submitted to Admin for review and publication.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PolicyEditor userRole="hr" userId="hr-001" userName="HR Manager" />
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyManagement;
