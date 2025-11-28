import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId } from "declarations/backup_backend";
import { HttpAgent } from "@dfinity/agent";

const AuthContext = createContext();
const BOOT_TIME_KEY = "canister_boot_time";
const fetchBootTime = async (actor) => {
  return await actor.getBootTime();
};
const MAX_TIME_TO_LIVE = 8 * 60 * 60 * 1000 * 1000 * 1000;
const identityProvider =
  import.meta.env.VITE_DFX_NETWORK === "ic"
    ? "https://identity.ic0.app"
    : `http://${
        import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY
      }.localhost:4943/`;

const getDefaultState = (authClient = undefined) => ({
  actor: undefined,
  authClient,
  isAuthenticated: false,
  principal: "Not Authenticated",
  role: null, // Role is an object like { owner: null } or null if no role
});

export const AuthProvider = ({ children }) => {
  const authClientRef = React.useRef();
  const [state, setState] = useState(getDefaultState());

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
    const agent = await HttpAgent.create({ identity });
    if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    }
    const backend_canister_actor = createActor(canisterId, { agent });
    try {
      const bootTime = await fetchBootTime(backend_canister_actor);
      const storedBootTime = localStorage.getItem(BOOT_TIME_KEY);
      if (storedBootTime && storedBootTime !== bootTime.toString()) {
        await authClient.logout();
        localStorage.removeItem(BOOT_TIME_KEY);
        setState(getDefaultState(authClient));
        return;
      } else {
        localStorage.setItem(BOOT_TIME_KEY, bootTime.toString());
      }
    } catch (e) {
      console.error("Failed to fetch boot time", e);
    }
    const isAuthenticated = await authClient.isAuthenticated();
    const roleResult = await backend_canister_actor.my_role();
    // roleResult is an array: [{ owner: null }] or [] if no role
    const role = roleResult[0] || null;
    setState((prev) => ({
      ...prev,
      actor: backend_canister_actor,
      authClient,
      isAuthenticated,
      principal: identity.getPrincipal().toString(),
      role,
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
    setState(getDefaultState(authClient));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
