import React, { useEffect, useState } from "react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null); // ✨ नया state

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingCoupon ? "PUT" : "POST";
    const url = editingCoupon
      ? `/api/coupons/${editingCoupon._id}`
      : "/api/coupons";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save coupon");

      // reset
      setForm({
        code: "",
        discountType: "percent",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
      });
      setEditingCoupon(null);
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      alert("Error saving coupon");
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      expiryDate: coupon.expiryDate.split("T")[0], // तारीख fix करने के लिए
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      alert("Error deleting coupon");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Coupons</h1>

      <button
        onClick={() => {
          setEditingCoupon(null); // नया add करने से पहले reset
          setForm({
            code: "",
            discountType: "percent",
            discountValue: "",
            minOrderAmount: "",
            expiryDate: "",
          });
          setShowModal(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add New Coupon
      </button>

      {/* Coupons Table */}
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Value</th>
            <th className="border px-4 py-2">Min Order</th>
            <th className="border px-4 py-2">Expiry</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="border px-4 py-2 font-bold">{c.code}</td>
              <td className="border px-4 py-2">{c.discountType}</td>
              <td className="border px-4 py-2">
                {c.discountType === "percent"
                  ? `${c.discountValue}%`
                  : `₹${c.discountValue}`}
              </td>
              <td className="border px-4 py-2">₹{c.minOrderAmount}</td>
              <td className="border px-4 py-2">
                {new Date(c.expiryDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingCoupon ? "Edit Coupon" : "Add Coupon"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Coupon Code"
                className="w-full mb-3 border rounded px-3 py-2"
                required
              />

              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full mb-3 border rounded px-3 py-2"
              >
                <option value="percent">Percent</option>
                <option value="flat">Flat</option>
              </select>

              <input
                name="discountValue"
                type="number"
                value={form.discountValue}
                onChange={handleChange}
                placeholder="Discount Value"
                className="w-full mb-3 border rounded px-3 py-2"
                required
              />

              <input
                name="minOrderAmount"
                type="number"
                value={form.minOrderAmount}
                onChange={handleChange}
                placeholder="Minimum Order Amount"
                className="w-full mb-3 border rounded px-3 py-2"
              />

              <input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full mb-3 border rounded px-3 py-2"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingCoupon ? "Update Coupon" : "Save Coupon"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
