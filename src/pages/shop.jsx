import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Shop({ setCartCount }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");
  const [size, setSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch products from API with filters
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        search,
        category,
        brand,
        rating,
        size,
        minPrice,
        maxPrice,
        sort,
      });

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, brand, rating, size, minPrice, maxPrice, sort]);

  const addToCart = async (product) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      // ✅ Update cart count
      const cartRes = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await cartRes.json();
      if (Array.isArray(cartData.items)) {
        setCartCount(cartData.items.reduce((sum, i) => sum + i.quantity, 0));
      }

      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex">
      {/* 🔹 Sidebar Filters */}
      <aside className="w-64 p-4 border-r bg-gray-50 space-y-6">
        {/* Search */}
        <div>
          <h3 className="font-semibold mb-2">Search</h3>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Category */}
        <div>
          <h3 className="font-semibold mb-2">Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">All</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Laptops">Laptops</option>
            <option value="Shoes">Shoes</option>
            <option value="Clothing">Clothing</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <h3 className="font-semibold mb-2">Brand</h3>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">All</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
          </select>
        </div>

        {/* Size */}
        <div>
          <h3 className="font-semibold mb-2">Size</h3>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 border px-2 py-1 rounded"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="font-semibold mb-2">Rating</h3>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">All</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </aside>

      {/* 🔹 Product Grid */}
      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          products.map((p) => (
  <div key={p._id} className="border rounded shadow p-4 bg-white">
    <Link to={`/product/${p._id}`}>
      <img
        src={p.image || "https://picsum.photos/200"}
        alt={p.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{p.name}</h3>
    </Link>
    <p className="text-gray-600">₹{p.price?.toLocaleString()}</p>
    <p className="text-yellow-500">⭐ {p.rating || 0}</p>
    <button
      onClick={() => addToCart(p)}
      className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Buy Now
    </button>
  </div>
))

        )}
      </main>
    </div>
  );
}
