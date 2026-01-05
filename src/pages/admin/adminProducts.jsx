
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔍 filters state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, categoryFilter, minPrice, maxPrice, sortBy, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  // 🔎 filtering + sorting logic
  const applyFilters = () => {
    let data = [...products];

    if (search) {
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((p) => p.category === categoryFilter);
    }

    if (minPrice) data = data.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) data = data.filter((p) => p.price <= Number(maxPrice));

    if (sortBy === "priceLowHigh") data.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow") data.sort((a, b) => b.price - a.price);
    else if (sortBy === "nameAZ") data.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "nameZA") data.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "newest") data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
    console.log("🧾 Submitting product:", form);


    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save product");

      setForm({ name: "", price: "", description: "", imageUrl: "", category: "" });
      setEditingProduct(null);
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
  setEditingProduct(product);
  setForm({
    name: product.name,
    price: product.price,
    description: product.description,
    imageUrl: product.imageUrl || product.image || "",
    category: product.category || "",
  });
  setShowModal(true);
};

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      alert("Error deleting product");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* 🔍 Filters Panel */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[150px]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded w-24"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded w-24"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low → High</option>
          <option value="priceHighLow">Price: High → Low</option>
          <option value="nameAZ">Name: A → Z</option>
          <option value="nameZA">Name: Z → A</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <button
        onClick={() => {
          setEditingProduct(null);
          setForm({ name: "", price: "", description: "", imageUrl: "", category: "" });
          setShowModal(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add New Product
      </button>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod._id} className="border-t">
                <td className="border px-4 py-2">{prod.name}</td>
                <td className="border px-4 py-2">₹{prod.price}</td>
                <td className="border px-4 py-2">{prod.category || "-"}</td>
                <td className="border px-4 py-2">{prod.description}</td>
                <td className="border px-4 py-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/admin/products/${prod._id}`}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 inline-flex items-center gap-1"
                  >
                    <FaEye />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingProduct ? "Update" : "Add"} Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
