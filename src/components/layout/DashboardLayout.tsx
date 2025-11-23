import React from 'react';
import DashboardNavbar from './DashboardNavbar';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;