// src/layout/DashboardLayout.jsx
import React from 'react';
import Sidebar from '../components/SideBar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
