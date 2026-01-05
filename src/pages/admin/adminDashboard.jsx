import { useState } from "react";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminAnalytics from "./AdminAnalytics";
import AdminCategories from "./AdminCategories";
import AdminCoupons from "./AdminCoupons";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics"); // default analytics
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { key: "analytics", label: "Dashboard" },
    { key: "orders", label: "Orders" },
    { key: "products", label: "Products" },
    { key: "users", label: "Users" },
    { key: "categories", label: "Categories" },
    { key: "coupons", label: "Coupons" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2 rounded transition-colors ${
                activeTab === tab.key
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden w-full bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="bg-gray-800 text-white w-64 h-full p-6">
            <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSidebarOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded transition-colors ${
                    activeTab === tab.key
                      ? "bg-gray-700 font-semibold"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "categories" && <AdminCategories />}
        {activeTab === "coupons" && <AdminCoupons />}
      </main>
    </div>
  );
}
