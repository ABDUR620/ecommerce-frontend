import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Fetch Product + Reviews
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();

        // कुछ backend { product, reviews } देता है, कुछ पूरा object
        setProduct(data.product || data);
        setReviews(data.reviews || data.product?.reviews || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    })();
  }, [id]);

  // ✅ Add Review
  const submitReview = async () => {
    if (!token) {
      toast.error("You must be logged in to review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) throw new Error("Failed to add review");

      const data = await res.json();

      // कुछ APIs { review } return करती हैं, कुछ updated product
      if (data.review) {
        setReviews([data.review, ...reviews]);
      } else if (data.reviews) {
        setReviews(data.reviews);
      }

      setComment("");
      setRating(5);
      toast.success("Review added!");
    } catch (err) {
      console.error(err);
      toast.error("Could not submit review");
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 🔹 Product Details */}
      <div className="flex gap-6">
        <img
  src={
    product.imageUrl && product.imageUrl.startsWith("http")
      ? product.imageUrl
      : product.image && product.image.startsWith("http")
      ? product.image
      : "https://via.placeholder.com/300"
  }
  alt={product.name}
  className="w-72 h-72 object-cover rounded border"
/>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl mt-4 text-blue-600">
            ₹{product.price?.toLocaleString()}
          </p>
          <p className="text-yellow-500">⭐ {product.rating || 0}</p>
        </div>
      </div>

      {/* 🔹 Review Form */}
      <div className="mt-10 bg-gray-100 p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="font-semibold">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ★
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        <button
          onClick={submitReview}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Review
        </button>
      </div>

      {/* 🔹 Reviews List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((r, i) => (
            <div
              key={i}
              className="border-b py-3 flex flex-col gap-1 bg-white p-3 rounded mb-3"
            >
              <p className="font-semibold">⭐ {r.rating}</p>
              <p>{r.comment}</p>
              <small className="text-gray-500">
                by {r.user?.name || "Anonymous"}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
