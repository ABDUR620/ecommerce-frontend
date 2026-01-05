import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger icons

export default function Header({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = localStorage.getItem("isAuth") === "true";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("token");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/home" className="text-2xl font-bold">
        🛒 MyShop
      </Link>

      {isAuth && (
        <>
          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/home">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/orders">My Orders</Link>

            {/* Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center"
            >
              🛍️
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Logout */}
            {location.pathname !== "/login" && (
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col gap-4 p-4 md:hidden z-50">
              <Link to="/home" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>

              {/* Cart Icon */}
              <button
                onClick={() => {
                  navigate("/cart");
                  setMenuOpen(false);
                }}
                className="relative flex items-center"
              >
                🛍️
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              {location.pathname !== "/login" && (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </>
      )}
    </header>
  );
}
