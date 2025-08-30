import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Package, CreditCard, User, Plus, Edit, Trash2 } from 'lucide-react';
import logo from '../assets/logo.svg';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`dashboard-sidebar fixed md:relative top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <button
          className="md:hidden p-2 rounded-full border bg-white shadow absolute right-4 absolute top-4"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>
      <div className="dashboard-sidebar-logo flex justify-between items-center p-4 mt-4 mb-0">
        <img src={logo} alt="Laksh closet" className="h-12" />
      </div>
      
      <nav className="dashboard-sidebar-nav">
        <SidebarItem 
          icon={<Home size={18} />} 
          label="Dashboard" 
          to="/admin/dashboard" 
        />
        <SidebarItem 
          icon={<Package size={18} />} 
          label="Products" 
          to="/admin/products" 
        />
        <SidebarItem 
          icon={<Plus size={18} />} 
          label="Add Product" 
          to="/admin/add-product" 
        />
        
      </nav>
    </aside>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to);

  return (
    <div
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 p-3 cursor-pointer rounded-lg transition-colors ${
        isActive ? "bg-[#A54AFF] text-white" : "text-gray-800 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
