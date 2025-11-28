import React from "react";
import { useAuth } from "./hooks/useAuth.jsx";

function App() {
  const { logout, principal, actor, role } = useAuth();

  const test = async () => {
    if (!actor) return;
    await actor.test_query();
    console.log("test_query");
    console.log(actor);
    console.log(role);
    console.log(principal);
  };

  return (
    <main>
      <h1>App</h1>
      <p>Authenticated</p>
      <p>Principal: {principal}</p>
      <button onClick={test}>test</button>
      <button onClick={logout}>Logout</button>
    </main>
  );
}
export default App;
