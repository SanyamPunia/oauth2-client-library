import React, { createContext, useState, useContext, useEffect } from "react";
import oauthClient from "../auth";

const AuthContext = createContext();

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
    const tokens = oauthClient.getStoredTokens();
    if (tokens && tokens.access_token) {
      try {
        const userData = await fetchUserInfo(tokens.access_token);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking auth status:", error);
        handleAuthError();
      }
    }
  };

  const handleAuthError = () => {
    setIsAuthenticated(false);
    setUser(null);
    oauthClient.clearTokens();
  };

  const login = () => {
    const { authUrl } = oauthClient.startAuthFlow();
    window.location.href = authUrl;
  };

  const handleCallback = async (code) => {
    try {
      const tokens = await oauthClient.handleCallback({ code });
      const userData = await fetchUserInfo(tokens.access_token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Callback error:", error);
      handleAuthError();
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    oauthClient.clearTokens();
  };

  const fetchUserInfo = async (accessToken) => {
    const response = await fetch(
      `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    return response.json();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, handleCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
};
