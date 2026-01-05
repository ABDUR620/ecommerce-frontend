import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
} from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    })();
  }, [token]);

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-2xl font-bold">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold mb-2">Shipped Orders</h2>
          <p className="text-2xl font-bold">{stats.shippedOrders}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold mb-2">Delivered Orders</h2>
          <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Orders by Status */}
        <div className="p-6 bg-white shadow rounded-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Orders Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Pending", value: stats.pendingOrders },
                { name: "Shipped", value: stats.shippedOrders },
                { name: "Delivered", value: stats.deliveredOrders },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Orders Distribution */}
        <div className="p-6 bg-white shadow rounded-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Orders Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Pending", value: stats.pendingOrders },
                  { name: "Shipped", value: stats.shippedOrders },
                  { name: "Delivered", value: stats.deliveredOrders },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#10B981"
                dataKey="value"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Revenue Trend */}
        <div className="p-6 bg-white shadow rounded-lg lg:col-span-2 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { name: "Total Orders", value: stats.totalOrders },
                { name: "Total Revenue", value: stats.totalRevenue },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
