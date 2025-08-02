import React, { useState } from "react";
import { Menu, X, Home, Plus, Package, User, CreditCard } from "lucide-react";
import './DashboardSidebar.css';
import logo from "../assets/logo.svg";

const orders = {
  today: [
    { title: "Salary for July", amount: "+ ₹5000", time: "04:30 PM" },
    { title: "Salary for July", amount: "+ ₹5000", time: "04:30 PM" },
  ],
  yesterday: [
    { title: "Salary for July", amount: "+ ₹5000", time: "04:30 PM" },
    { title: "Salary for July", amount: "+ ₹5000", time: "04:30 PM" },
  ],
};

export default function OrdersDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] ">
      {/* Hamburger for small screens */}
      <button
        className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-full border bg-white shadow"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
        style={{ minHeight: "100vh" }}
      >
        <div className="dashboard-sidebar-logo flex justify-between items-center">
          <img src={logo} alt="Laksh closet" className="h-12" />
          {/* Close button for small screens */}
          <button
            className="md:hidden p-2 rounded-full border bg-white shadow"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="dashboard-sidebar-nav">
          <SidebarItem icon={<Home size={18} />} label="Dashboard" />
          <SidebarItem icon={<Package size={18} />} label="Tracking" />
          <SidebarItem icon={<Package size={18} />} label="Products" />
          <SidebarItem icon={<Plus size={18} />} label="Add" />
          <SidebarItem icon={<CreditCard size={18} />} label="Orders" active />
          <SidebarItem icon={<User size={18} />} label="User" />
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="dashboard-main-content">
        <div className="dashboard-orders-card">
          <h1 className="dashboard-orders-title">Orders</h1>
          {Object.entries(orders).map(([section, items]) => (
            <div key={section}>
              <h2 className="dashboard-orders-section">{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
              {items.map((item, i) => (
                <div key={i} className="dashboard-order-item">
                  <div className="dashboard-order-details">
                    <span className="dashboard-order-amount">{item.amount}</span>
                    <span className="dashboard-order-title">{item.title}</span>
                  </div>
                  <span className="dashboard-order-time">{item.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
        active
          ? "bg-[#F5F2FF] text-[#A54AFF] font-medium"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  );
}
