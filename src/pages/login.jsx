import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        alert("Server error: Invalid JSON");
        return;
      }

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token || !data._id || !data.email) {
        alert("Login failed: Incomplete server response");
        return;
      }

      localStorage.setItem("isAuth", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.isAdmin ? "admin" : "user");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          _id: data._id,
        })
      );

      navigate(data.isAdmin ? "/admin" : "/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <AnimatePresence mode="wait">
          {!isSignup ? (
            <motion.form
              key="login"
              onSubmit={handleSubmit}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
              >
                Login
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              onSubmit={handleSubmit}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
              >
                Sign Up
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-600 mt-6">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
