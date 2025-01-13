import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Auth0 Demo</h1>
        {isAuthenticated && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
