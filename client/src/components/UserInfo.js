import React from "react";
import { useAuth } from "../contexts/AuthContext";

const UserInfo = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{user.name}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="font-semibold">Nickname:</p>
          <p>{user.nickname}</p>
        </div>
        <div>
          <p className="font-semibold">Sub:</p>
          <p>{user.sub}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
