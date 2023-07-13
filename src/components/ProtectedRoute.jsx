import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";

import { auth } from "src/backend/db_config";

import LoadingScreen from "./LoadingScreen";

function Protected({ isSignedIn, isEmailVerified, children }) {
  const [user, loading] = useAuthState(auth);
  // Check if user is still beeing fetched
  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/unverified" replace />;
  }

  return children;
}
export default Protected;
