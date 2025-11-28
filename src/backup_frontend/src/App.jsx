import React from "react";
import { useAuth } from "./hooks/useAuth.jsx";
import OwnerDashboard from "./dashboards/OwnerDashboard.jsx";
import AdminDashboard from "./dashboards/AdminDashboard.jsx";
import UserDashboard from "./dashboards/UserDashboard.jsx";

function Dashboard() {
  const { role } = useAuth();
  if (role?.owner !== undefined) {
    return <OwnerDashboard />;
  } else if (role?.admin !== undefined) {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
}

function App() {
  return (
    <main>
      <Dashboard />
    </main>
  );
}
export default App;
