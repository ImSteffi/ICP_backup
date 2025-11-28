import React from "react";
import { useAuth } from "../hooks/useAuth.jsx";

function UserDashboard() {
  const { principal, isAuthenticated } = useAuth();
  return (
    <main>
      <h1>User Dashboard</h1>
      <p>Welcome to the User Dashboard</p>
      <p>Principal: {principal}</p>
      <p>Role: User</p>
      <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
    </main>
  );
}
export default UserDashboard;
