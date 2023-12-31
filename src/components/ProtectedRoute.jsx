import React from "react";
import { Navigate } from "react-router-dom";

import LoadingScreen from "./LoadingScreen";

function Protected({ isSignedIn, isEmailVerified, isProvider, children }) {
  // Check if user is still beeing fetched
  if (isSignedIn === null) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isEmailVerified && !isProvider) {
    return <Navigate to="/unverified" replace />;
  }

  return children;
}
export default Protected;
