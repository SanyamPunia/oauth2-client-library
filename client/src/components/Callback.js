import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleCallback } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      handleCallback(code, state).then(() => {
        navigate("/");
      });
    }
  }, [handleCallback, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default Callback;