import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X, Home, Package, CreditCard, User, Filter, Download } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DashboardSidebar.css";
import logo from "../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";

// Main Component
export default function OrdersDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState({});
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/orders/paid`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const markShipped = async (orderId) => {
    const trackingId = trackingInputs[orderId];
    if (!trackingId) return toast.warning("⚠️ Please enter tracking ID first");

    try {
      setLoadingOrderId(orderId);
      await axios.put(
        `${import.meta.env.VITE_RENDER_EXTERNAL_URL}/api/orders/${orderId}/ship`,
        { trackingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Order marked as shipped & email sent!");
      setTrackingInputs((prev) => ({ ...prev, [orderId]: "" }));
      fetchOrders();
    } catch (error) {
      console.error("Error marking shipped:", error);
      toast.error("❌ Failed to mark order as shipped");
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const shippedOrders = orders.filter((o) => o.deliveryStatus === "shipped");
  const unshippedOrders = orders.filter((o) => o.deliveryStatus === "pending");

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Hamburger */}
      <button
        className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-full border bg-white shadow"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="dashboard-main-content p-6 w-full">
        <div className="orders-header flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex gap-4">
            <button className="filter-btn flex items-center gap-1">
              <Filter size={18} /> Filter
            </button>
            <button className="export-btn flex items-center gap-1">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {loading ? (
  <div className="orders-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonOrderCard key={i} />
    ))}
  </div>
) : (
          <div className="orders-container space-y-8">
            <OrderSection
              title={`Pending Orders (${unshippedOrders.length})`}
              orders={unshippedOrders}
              trackingInputs={trackingInputs}
              setTrackingInputs={setTrackingInputs}
              markShipped={markShipped}
              loadingOrderId={loadingOrderId}
              isPending
            />
            <OrderSection
              title={`Shipped Orders (${shippedOrders.length})`}
              orders={shippedOrders}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Sidebar
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => (
  <aside
    className={`dashboard-sidebar fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:relative md:translate-x-0`}
  >
    <div className="dashboard-sidebar-logo flex justify-between items-center p-4">
      <img src={logo} alt="Laksh closet" className="h-12" />
      <button
        className="md:hidden p-2 rounded-full border bg-white shadow"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={24} />
      </button>
    </div>
    <nav className="dashboard-sidebar-nav">
      <SidebarItem icon={<Home size={18} />} label="Dashboard" to="/dashboard" />
      <SidebarItem icon={<Package size={18} />} label="Update Product" to="/admin/update-product" />
      <SidebarItem icon={<CreditCard size={18} />} label="Add Product" to="/admin/add-product" />
      <SidebarItem icon={<CreditCard size={18} />} label="Delete Product" to="/admin/delete-product" />
      <SidebarItem icon={<User size={18} />} label="User" to="/user" />
    </nav>
  </aside>
);

// Sidebar Item
const SidebarItem = ({ icon, label, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

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

// Order Section
const OrderSection = ({ title, orders, trackingInputs, setTrackingInputs, markShipped, loadingOrderId, isPending }) => (
  <div className="order-section">
    <h2 className="section-title">{title}</h2>
    {orders.length === 0 && isPending ? (
      <p className="empty-state">✅ No pending orders</p>
    ) : (
      <div className="orders-grid">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            trackingInputs={trackingInputs}
            setTrackingInputs={setTrackingInputs}
            markShipped={markShipped}
            loadingOrderId={loadingOrderId}
            isPending={isPending}
          />
        ))}
      </div>
    )}
  </div>
);

// Order Card
const OrderCard = ({ order, trackingInputs, setTrackingInputs, markShipped, loadingOrderId, isPending }) => (
  <div className={`order-card ${!isPending ? "shipped" : ""}`}>
    <div className="order-header">
      <span className="order-id">#{order._id.slice(-5)}</span>
      <span className={`order-status ${order.deliveryStatus}`}>{order.deliveryStatus}</span>
    </div>

    <div className="order-body">
      <div className="order-info">
        <Info label="Customer" value={order.customerName} />
        <Info label="Email" value={order.email} />
        <Info label="Phone" value={order.phone} />
        <Info label="City" value={order.city} />
        <Info label="State" value={order.state} />
        <Info label="Address" value={order.address} />
        <Info label="Pin Code" value={order.pinCode} />

        {/* Loop through cart items */}
        {order.cart && order.cart.map((item, index) => (
  <React.Fragment key={index}>
    <Info
      label="Product ID"
      value={
        <a
          href={`https://laksh-closet-lc.vercel.app/products/${item.productId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A54AFF] hover:underline"
        >
          {item.productId}
        </a>
      }
    />
     {/* ✅ New size info */}
    <Info label="Size" value={item.size || "N/A"} />
    <Info label="Quantity" value={item.quantity} />
  </React.Fragment>
))}

        <Info
          label="Date"
          value={new Date(order.otpGeneratedAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        />
        <Info label="Amount" value={`₹${order.totalAmount}`} className="amount" />
        <Info
          label="Payment Status"
          value={order.paymentStatus.toUpperCase()}
          badge={order.paymentStatus}
        />
        <Info
          label="Delivery Status"
          value={order.deliveryStatus.toUpperCase()}
          badge={order.deliveryStatus}
        />
        {!isPending && (
          <Info label="Tracking ID" value={order.trackingId} className="tracking-id" />
        )}
      </div>

      {isPending && (
        <div className="tracking-input">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            className="tracking-field"
            value={trackingInputs[order._id] || ""}
            onChange={(e) =>
              setTrackingInputs({ ...trackingInputs, [order._id]: e.target.value })
            }
          />
          {loadingOrderId === order._id ? (
            <div className="w-6 h-6 border-4 border-[#A54AFF] border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <button
              onClick={() => markShipped(order._id)}
              className="ship-button bg-[#A54AFF] text-white px-4 py-2 rounded hover:bg-[#923fff] transition duration-200"
            >
              Mark Shipped
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

// Info Display
const Info = ({ label, value, badge, className }) => (
  <div className="info-group">
    <label>{label}</label>
    {badge ? <p className={`status-badge ${badge === "paid" || badge === "shipped" ? "success" : "pending"}`}>{value}</p> : <p className={className}>{value}</p>}
  </div>
);

const SkeletonOrderCard = () => (
  <div className="order-card">
    <div className="skeleton skeleton-card"></div>
    <div className="p-4">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  </div>
);
