import React, { useEffect, useState } from "react";

export default function AdminCategories() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const categoryData = { name, description };

    try {
      let res;
      if (editId) {
        res = await fetch(`http://localhost:5000/api/categories/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });
      } else {
        res = await fetch("http://localhost:5000/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });
      }

      const data = await res.json();
      console.log("Server response:", data);

      setName("");
      setDescription("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setEditId(cat._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Delete response:", data);
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">
        {editId ? "Update Category" : "Add Category"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editId
              ? "Update Category"
              : "Add Category"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                setDescription("");
              }}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Categories List */}
      <h3 className="text-xl font-semibold mb-2">Categories</h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 p-3 rounded hover:bg-gray-700 transition"
          >
            <div className="mb-2 sm:mb-0">
              <p className="font-bold">{cat.name}</p>
              <p className="text-sm text-gray-400">{cat.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEdit(cat)}
                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
