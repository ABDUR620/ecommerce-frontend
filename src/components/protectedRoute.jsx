// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const isAuth = localStorage.getItem("isAuth") === "true";
  const role = localStorage.getItem("role");

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== "admin") {
    return <div className="text-center mt-20 text-red-600 font-bold">You are not authorized to view this page.</div>;
  }

  return children;
}
