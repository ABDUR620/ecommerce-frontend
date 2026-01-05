import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (token) fetchOrders();
    else {
      setError("You are not authorized to view this page.");
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Failed to fetch orders");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data);
      setError("");
    } catch (err) {
      setError("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return alert("Failed to update status");
      fetchOrders();
      setShowModal(false);
    } catch {
      alert("Error updating status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return alert("Failed to delete order");
      fetchOrders();
      alert("Order deleted successfully!");
    } catch {
      alert("Error deleting order");
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "amountLow") return a.totalAmount - b.totalAmount;
      if (sortBy === "amountHigh") return b.totalAmount - a.totalAmount;
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  if (loading) return <div className="text-center py-10">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders (Admin)</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by user/email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="amountLow">Amount: Low → High</option>
          <option value="amountHigh">Amount: High → Low</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Table wrapper scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border divide-y">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Items</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="py-2 px-4">{order.user?.name || "Unknown"}</td>
                <td className="py-2 px-4">{order.items.length}</td>
                <td className="py-2 px-4">₹{order.totalAmount}</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => openModal(order)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>

            <div className="mb-2">
              <strong>User:</strong> {selectedOrder.user?.name} <br />
              <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
            </div>

            <div className="mb-2">
              <strong>Shipping Address:</strong>
              <div className="text-sm text-gray-700 mt-1">
                {selectedOrder.address?.fullName}, {selectedOrder.address?.street},{" "}
                {selectedOrder.address?.city}, {selectedOrder.address?.state},{" "}
                {selectedOrder.address?.postalCode}, {selectedOrder.address?.country} <br />
                📞 {selectedOrder.address?.phone}
              </div>
            </div>

            <div className="mb-2">
              <strong>Items:</strong>
              <ul className="list-disc pl-5 mt-1">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product?.name || "Unknown"} - Qty: {item.quantity} - ₹
                    {item.product?.price}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-2">
              <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <strong>Status:</strong>
              <select
                defaultValue={selectedOrder.status}
                onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                className="border px-2 py-1 rounded flex-1"
              >
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
