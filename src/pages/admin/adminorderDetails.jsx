import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token") || "";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const updateStatus = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) alert("Status updated");
      else alert("Failed to update status");
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>User:</strong> {order.user?.name || "Unknown"}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>
      <ul className="list-disc ml-6">
        {order.items.map((item, i) => (
          <li key={i}>
            {item.product?.name || "Unknown"} - {item.quantity} pcs
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-1">
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button onClick={updateStatus} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
          Update Status
        </button>
      </div>
    </div>
  );
}
