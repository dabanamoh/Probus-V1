import React from 'react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import AdminApprovals from '../components/AdminApprovals';

const ApprovalsPage = () => {
  return (
    <DashboardLayout>
      <AdminApprovals />
    </DashboardLayout>
  );
};

export default ApprovalsPage;
