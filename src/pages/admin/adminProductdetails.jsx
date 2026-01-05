import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminProductDetails() {
  const { id } = useParams(); // URL से productId
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Fetch Product with Reviews
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  // ✅ Delete Review
  const deleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/products/${id}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setProduct({
        ...product,
        reviews: product.reviews.filter((r) => r._id !== reviewId),
      });

      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete review");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 🔹 Product Info */}
      <div className="flex gap-6 mb-10">
        <img
          src={product.image || "https://picsum.photos/300"}
          alt={product.name}
          className="w-64 h-64 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-xl mt-4 text-blue-600">
            ₹{product.price?.toLocaleString()}
          </p>
          <p className="text-yellow-500">⭐ {product.rating || 0}</p>
        </div>
      </div>

      {/* 🔹 Reviews Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {(!product.reviews || product.reviews.length === 0) ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          product.reviews.map((r) => (
            <div
              key={r._id}
              className="border p-4 rounded mb-3 bg-white shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">⭐ {r.rating}</p>
                <p>{r.comment}</p>
                <small className="text-gray-500">
                  by {r.user?.name || "Anonymous"}
                </small>
              </div>
              <button
                onClick={() => deleteReview(r._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
