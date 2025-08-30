import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FC] admin-shell">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full border bg-white shadow"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>
      

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="dashboard-main-content p-6 w-full md:ml-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
