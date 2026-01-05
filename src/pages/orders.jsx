// src/pages/Orders.jsx
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch orders");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [token]);

  if (loading) return <p className="p-6 text-center">⏳ Loading your orders...</p>;

  if (orders.length === 0)
    return <p className="p-6 text-center">🛒 You have no orders yet.</p>;

  async function cancelOrder(orderId) {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Failed to cancel order: ${data.message || res.statusText}`);
        return;
      }

      alert("Order cancelled successfully");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      alert("Something went wrong while cancelling order");
      console.error(err);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center sm:text-left">📦 My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-xl p-4 sm:p-6 bg-white shadow-md hover:shadow-lg transition"
        >
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="text-sm">
              <span className="font-semibold">Order ID:</span> {order._id}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Order Items */}
          <div className="divide-y">
            {order.items.map((i) => (
              <div
                key={i._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3"
              >
                <div className="flex items-center gap-3">
                  {i.product?.image ? (
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded-lg border">
                      No Image
                    </div>
                  )}

                  <div>
                    <div className="font-medium">{i.product?.name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {i.quantity} × ₹{i.product?.price?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="font-semibold text-right sm:text-left">
                  ₹{(i.product?.price || 0) * i.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
            <h3 className="font-semibold mb-2">🚚 Shipping Address</h3>
            {order.address ? (
              <>
                <p>{order.address.fullName}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
              </>
            ) : (
              <p className="text-red-600">No address information found.</p>
            )}
          </div>

          {/* Status + Total */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className={`font-medium ${
                  order.status === "Pending"
                    ? "text-blue-600"
                    : order.status === "Cancelled"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total:</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>

            {/* Cancel Button */}
            {order.status === "Pending" && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="mt-4 w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                ❌ Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
