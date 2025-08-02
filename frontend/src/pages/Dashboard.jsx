import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X, Home, Plus, Package, User, CreditCard, Filter, Download } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DashboardSidebar.css";
import logo from "../assets/logo.svg";

export default function OrdersDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState({});

  const token = localStorage.getItem("token"); // stored after admin login

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/paid", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("❌ Failed to fetch orders");
      setLoading(false);
    }
  };

  const markShipped = async (orderId) => {
    try {
      const trackingId = trackingInputs[orderId];
      if (!trackingId) {
        toast.warning("⚠️ Please enter tracking ID first");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/ship`,
        { trackingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Order marked as shipped & email sent!");
      setTrackingInputs((prev) => ({ ...prev, [orderId]: "" })); // clear input
      fetchOrders(); // refresh list
    } catch (error) {
      console.error("Error marking shipped:", error);
      toast.error("❌ Failed to mark order as shipped");
    }
  };

  const shippedOrders = orders.filter((o) => o.deliveryStatus === "shipped");
  const unshippedOrders = orders.filter((o) => o.deliveryStatus === "pending");

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />

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
      <main className="dashboard-main-content p-6">
        <div className="orders-header">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex gap-4">
            <button className="filter-btn">
              <Filter size={18} />
              Filter
            </button>
            <button className="export-btn">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading orders...</div>
        ) : (
          <div className="orders-container">
            <div className="order-section">
              <h2 className="section-title">Pending Orders ({unshippedOrders.length})</h2>
              {unshippedOrders.length === 0 ? (
                <p className="empty-state">✅ No pending orders</p>
              ) : (
                <div className="orders-grid">
                  {unshippedOrders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">#{order._id.slice(-5)}</span>
                        <span className="order-status pending">Pending</span>
                      </div>
                      
                      <div className="order-body">
                        <div className="order-info">
                          <div className="info-group">
                            <label>Customer</label>
                            <p>{order.customerName}</p>
                          </div>
                          <div className="info-group">
                            <label>Email</label>
                            <p>{order.email}</p>
                          </div>
                          <div className="info-group">
                            <label>Date</label>
                            <p>{new Date(order.otpGeneratedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}</p>
                          </div>
                          <div className="info-group">
                            <label>Amount</label>
                            <p className="amount">₹{order.totalAmount}</p>
                          </div>
                          <div className="info-group">
                            <label>Payment Status</label>
                            <p className={`status-badge ${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                              {order.paymentStatus.toUpperCase()}
                            </p>
                          </div>
                          <div className="info-group">
                            <label>Delivery Status</label>
                            <p className={`status-badge ${order.deliveryStatus === 'shipped' ? 'success' : 'pending'}`}>
                              {order.deliveryStatus.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="tracking-input">
                          <input
                            type="text"
                            placeholder="Enter Tracking ID"
                            className="tracking-field"
                            value={trackingInputs[order._id] || ""}
                            onChange={(e) =>
                              setTrackingInputs({
                                ...trackingInputs,
                                [order._id]: e.target.value,
                              })
                            }
                          />
                          <button
                            onClick={() => markShipped(order._id)}
                            className="ship-button"
                          >
                            Mark Shipped
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="order-section">
              <h2 className="section-title">Shipped Orders ({shippedOrders.length})</h2>
              <div className="orders-grid">
                {shippedOrders.map((order) => (
                  <div key={order._id} className="order-card shipped">
                    <div className="order-header">
                      <span className="order-id">#{order._id.slice(-5)}</span>
                      <span className="order-status shipped">Shipped</span>
                    </div>
                    
                    <div className="order-body">
                      <div className="order-info">
                        <div className="info-group">
                          <label>Customer</label>
                          <p>{order.customerName}</p>
                        </div>
                        <div className="info-group">
                          <label>Email</label>
                          <p>{order.email}</p>
                        </div>
                        <div className="info-group">
                          <label>Date</label>
                          <p>{new Date(order.otpGeneratedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}</p>
                        </div>
                        <div className="info-group">
                          <label>Amount</label>
                          <p className="amount">₹{order.totalAmount}</p>
                        </div>
                        <div className="info-group">
                          <label>Payment Status</label>
                          <p className={`status-badge ${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                            {order.paymentStatus.toUpperCase()}
                          </p>
                        </div>
                        <div className="info-group">
                          <label>Delivery Status</label>
                          <p className={`status-badge ${order.deliveryStatus === 'shipped' ? 'success' : 'pending'}`}>
                            {order.deliveryStatus.toUpperCase()}
                          </p>
                        </div>
                        <div className="info-group">
                          <label>Tracking ID</label>
                          <p className="tracking-id">{order.trackingId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
