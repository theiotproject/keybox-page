import React from "react";
import { Navigate } from "react-router-dom";

function Protected({ isSignedIn, isEmailVerified, children }) {
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  if (!isEmailVerified) {
    return <Navigate to="/unverified" replace />;
  }
  return children;
}
export default Protected;
