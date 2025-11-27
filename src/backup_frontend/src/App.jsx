import React from "react";
import { useAuth } from "./hooks/useAuth.jsx";

function App() {
  const { login, logout, isAuthenticated, principal, actor } = useAuth();

  const test = async () => {
    if (!actor) return;
    await actor.test_query();
    console.log("test_query");
    console.log(actor);
    console.log(isAuthenticated);
    console.log(principal);
  };

  return (
    <main>
      <button onClick={login}>Login</button>
      {isAuthenticated ? (
        <div>
          <p>Authenticated</p>
          <p>Principal: {principal}</p>
          <button onClick={test}>test</button>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Not Authenticated</p>
      )}
    </main>
  );
}
export default App;
