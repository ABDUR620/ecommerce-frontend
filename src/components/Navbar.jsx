import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1 className="text-xl font-bold">MyShop</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-500">Home</a>
          <a href="/shop" className="hover:text-blue-500">Shop</a>
          <a href="/about" className="hover:text-blue-500">About</a>
        </nav>

        {/* Logout Button */}
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hidden md:block">
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md">
          <a href="/" className="block px-4 py-2 border-b">Home</a>
          <a href="/shop" className="block px-4 py-2 border-b">Shop</a>
          <a href="/about" className="block px-4 py-2 border-b">About</a>
          <button className="w-full text-left px-4 py-2 bg-red-500 text-white">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
