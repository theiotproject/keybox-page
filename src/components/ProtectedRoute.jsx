import React from "react";
import { Navigate } from "react-router-dom";

import { CircularProgress } from "@mui/material";

function Protected({ isSignedIn, isEmailVerified, children }) {
  // Check if user is still beeing fetched
  if (isSignedIn === null) {
    return <CircularProgress />;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/unverified" replace />;
  }

  return children;
}
export default Protected;
