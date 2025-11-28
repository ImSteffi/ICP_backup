import React from "react";
import { useAuth } from "../hooks/useAuth.jsx";

function AdminDashboard() {
  const { principal, isAuthenticated } = useAuth();
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard</p>
      <p>Principal: {principal}</p>
      <p>Role: Admin</p>
      <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
    </main>
  );
}
export default AdminDashboard;
