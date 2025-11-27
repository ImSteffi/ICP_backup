import React, { useState, useEffect } from "react";
import { createActor, canisterId } from "declarations/backup_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

const MAX_TIME_TO_LIVE = 8 * 60 * 60 * 1000 * 1000 * 1000;
const identityProvider =
  import.meta.env.VITE_DFX_NETWORK === "ic"
    ? "https://identity.ic0.app"
    : `http://${import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`;

const BOOT_TIME_KEY = "canister_boot_time";
const fetchBootTime = async (actor) => {
  return await actor.getBootTime();
};

function App() {
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: "Not Authenticated",
  });

  // Store AuthClient instance in a ref so it persists across renders
  const authClientRef = React.useRef();

  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create();
      authClientRef.current = authClient;
      await updateActor(authClient);
    };
    initAuthClient();
  }, []);

  const updateActor = async (authClient) => {
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    }
    const actor = createActor(canisterId, { agent });
    try {
      const bootTime = await fetchBootTime(actor);
      const storedBootTime = localStorage.getItem(BOOT_TIME_KEY);
      if (storedBootTime && storedBootTime !== bootTime.toString()) {
        await authClient.logout();
        localStorage.removeItem(BOOT_TIME_KEY);
        setState({
          actor: undefined,
          authClient,
          isAuthenticated: false,
          principal: "Not Authenticated",
        });
        return;
      } else {
        localStorage.setItem(BOOT_TIME_KEY, bootTime.toString());
      }
    } catch (e) {
      console.error("Failed to fetch boot time", e);
    }
    const isAuthenticated = await authClient.isAuthenticated();
    setState((prev) => ({
      ...prev,
      actor,
      authClient,
      isAuthenticated,
      principal: identity.getPrincipal().toString(),
    }));
  };

  const login = async () => {
    const authClient = authClientRef.current;
    if (!authClient) return;
    await authClient.login({
      identityProvider,
      maxTimeToLive: MAX_TIME_TO_LIVE,
      onSuccess: () => updateActor(authClient),
    });
  };

  const logout = async () => {
    const authClient = authClientRef.current;
    if (!authClient) return;
    await authClient.logout();
    localStorage.removeItem(BOOT_TIME_KEY);
    setState({
      actor: undefined,
      authClient,
      isAuthenticated: false,
      principal: "Not Authenticated",
    });
  };

  const test = async () => {
    if (!state.actor) return;
    await state.actor.test_query();
    console.log("test_query");
  };

  return (
    <main>
      <button onClick={login} disabled={!state.authClient}>
        Login
      </button>
      {state.isAuthenticated ? (
        <div>
          <p>Authenticated</p>
          <p>Principal: {state.principal}</p>
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