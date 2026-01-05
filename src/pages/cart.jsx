// src/pages/Cart.jsx
// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart({ setCartCount }) {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    const res = await fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data.items || []);

    // 🔹 Update header cart count
    if (Array.isArray(data.items)) {
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    loadCart();
  };

  const removeItem = async (id) => {
    await fetch(`/api/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadCart();
  };

  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block bg-white rounded shadow divide-y">
            {items.map((i) => (
              <div
                key={i._id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={i.product?.imageUrl || "https://picsum.photos/seed/cart/80"}
                    alt={i.product?.name}
                    className="w-16 h-16 -cover rounded"
                  />
                  <div className="ml-4">
                    <div className="font-semibold">{i.product?.name}</div>
                    <div className="text-sm text-gray-600">
                      ₹{i.product?.price?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(i._id, i.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{i.quantity}</span>
                  <button
                    onClick={() => updateQuantity(i._id, i.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(i._id)}
                    className="ml-3 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex flex-col gap-4">
            {items.map((i) => (
              <div
                key={i._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={i.product?.image || "https://picsum.photos/seed/cart/80"}
                    alt={i.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <div className="font-semibold">{i.product?.name}</div>
                    <div className="text-sm text-gray-600">
                      ₹{i.product?.price?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(i._id, i.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{i.quantity}</span>
                    <button
                      onClick={() => updateQuantity(i._id, i.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-semibold">
                    ₹{(i.product?.price || 0) * i.quantity}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(i._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold">
              Total: ₹{total.toLocaleString()}
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
