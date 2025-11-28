import React from "react";
import { useAuth } from "./hooks/useAuth.jsx";

function LoginPage() {
  const { login } = useAuth();
  return (
    <main>
      <h1>Login</h1>
      <p>Not Authenticated</p>
      <button onClick={login}>Login</button>
    </main>
  );
}
export default LoginPage;