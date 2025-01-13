import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginButton = () => {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={login}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Login with Auth0
    </button>
  );
};

export default LoginButton;
