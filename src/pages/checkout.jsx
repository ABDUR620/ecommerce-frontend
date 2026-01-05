import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [placing, setPlacing] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Address state
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("❌ Checkout fetch error:", err);
      }
    })();
  }, [token]);

  const total = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  useEffect(() => {
    setFinalTotal(total - discount);
  }, [total, discount]);

  const applyCoupon = async () => {
    if (!couponCode) {
      setCouponMsg("Please enter a coupon code");
      return;
    }
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: couponCode, orderAmount: total }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid coupon");

      setDiscount(data.discount);
      setCouponMsg(`✅ Coupon applied! You saved ₹${data.discount}`);
    } catch (err) {
      setDiscount(0);
      setCouponMsg(`❌ ${err.message}`);
    }
  };

  const placeOrder = async () => {
    for (const key in address) {
      if (!address[key]) {
        alert(`Please enter ${key}`);
        return;
      }
    }

    try {
      setPlacing(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          items,
          subtotal: total,
          discount,
          finalTotal,
          couponCode,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to place order");
      }

      navigate("/orders");
    } catch (e) {
      alert(e.message);
    } finally {
      setPlacing(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Items & Address */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold mb-2">🧾 Checkout</h2>

        {/* Cart Items */}
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items
              .filter((i) => i.product)
              .map((i) => (
                <div
                  key={i._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <img
                    src={
                      i.product?.image ||
                      "https://picsum.photos/seed/checkout/80"
                    }
                    alt={i.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 px-4 text-center sm:text-left mt-2 sm:mt-0">
                    <h3 className="font-bold">{i.product?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {i.quantity} × ₹{i.product?.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="font-semibold mt-2 sm:mt-0">
                    ₹{(i.product?.price || 0) * i.quantity}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Address Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full sm:col-span-2"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleAddressChange}
              className="border p-2 rounded w-full sm:col-span-2"
            />
          </div>
        </div>
      </div>

      {/* RIGHT: Summary */}
      <div className="bg-white shadow rounded-lg p-6 h-fit">
        <h3 className="text-lg font-bold mb-4">Order Summary</h3>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Items ({items.length})</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {/* Coupon input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
          {couponMsg && <p className="text-sm mt-1">{couponMsg}</p>}

          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount</span>
              <span>- ₹{discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>
        <button
          disabled={placing}
          onClick={placeOrder}
          className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
        >
          {placing ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
