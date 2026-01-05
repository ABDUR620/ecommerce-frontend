import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const sliderImages = [
  "/images/books.jpg",
  "/images/lop.jpg",
  "/images/copy.jpg",
];

export default function Home({ setCartCount }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // ✅ Add to Cart API
  const addToCart = async (product) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      toast.success(`${product.name} added to cart 🛍️`);

      // 🔄 Update cart count
      const cartRes = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await cartRes.json();
      if (Array.isArray(cartData.items)) {
        const count = cartData.items.reduce((sum, i) => sum + i.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding to cart");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("token");
    toast.success("Logged out successfully 🚪");
    navigate("/login");
  };

  // ✅ Slider auto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="text-center py-10 bg-blue-50 rounded-xl shadow-sm relative">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">
          Welcome to MyShop 🛒
        </h1>
        <p className="text-gray-600 text-lg">
          Best deals on top products – just for you!
        </p>
        
      </div>

      {/* Slider */}
      <div className="relative w-full h-64 mt-8 overflow-hidden rounded-xl shadow-lg">
        {sliderImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Products */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-center">
        🔥 Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">₹{product.price?.toLocaleString()}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
