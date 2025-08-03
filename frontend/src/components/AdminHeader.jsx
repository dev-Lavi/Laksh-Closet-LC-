import React from "react";
import { Filter, Download } from "lucide-react";
import "./AdminHeader.css";

const AdminHeader = ({ title = "Dashboard" }) => {
  return (
    <div className="orders-header">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default AdminHeader;
