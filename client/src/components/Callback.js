import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleCallback } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      handleCallback(code, state)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.error("Error during callback:", err);
          setError("Authentication failed. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Invalid callback parameters. Please try again.");
      setLoading(false);
    }
  }, [handleCallback, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
            <p>Please wait while we complete the authentication process.</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-500">
              Authentication Failed
            </h1>
            <p className="text-red-500">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-500">
              Authentication Successful
            </h1>
            <p>You have been successfully authenticated.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Callback;
