import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { AuthProvider } from "./hooks/useAuth.jsx";
import LoginPage from './LoginPage.jsx';
import { useAuth } from "./hooks/useAuth.jsx";

function AppRouter() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <App /> : <LoginPage />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>,
);
