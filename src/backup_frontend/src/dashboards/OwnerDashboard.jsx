import React from "react";
import { useAuth } from "../hooks/useAuth.jsx";

function OwnerDashboard() {
  const { principal, isAuthenticated } = useAuth();
  return (
    <main>
      <h1>Owner Dashboard</h1>
      <p>Welcome to the Owner Dashboard</p>
      <p>Principal: {principal}</p>
      <p>Role: Owner</p>
      <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
    </main>
  );
}
export default OwnerDashboard;
