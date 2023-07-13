import React, { useEffect } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "src/components/LoadingScreen";

import { auth } from "src/backend/db_config";

function SignOut() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);

  useEffect(() => {
    const handleSignOut = async () => {
      const success = await signOut();

      // If user was signed out successfully
      if (success) {
        navigate("/");
      }
    };

    handleSignOut();
  });

  return <LoadingScreen />;
}

export default SignOut;
