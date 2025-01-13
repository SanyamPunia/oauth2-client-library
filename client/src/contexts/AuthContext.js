import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user`, {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        credentials: "include",
      });
      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleCallback = async (code, state) => {
    try {
      const response = await fetch(`${apiUrl}/api/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, state }),
        credentials: "include",
      });
      if (response.ok) {
        await checkAuthStatus();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Callback error:", error);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiUrl}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, handleCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
};
