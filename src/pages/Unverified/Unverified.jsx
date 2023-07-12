import { useEffect } from "react";
import {
  useAuthState,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { Button, Typography } from "@mui/material";

import SignOutBtn from "src/components/SignOutBtn";

import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Unverified() {
  const { currentUser } = useAuthProvider();
  const navigate = useNavigate();

  // Once every 10 seconds site refreshes to check if user verified email
  useEffect(() => {
    // Check before interval if user is still unverified
    if (currentUser?.emailVerified) {
      navigate("/dashboard");
    }

    const isUserVerifiedInterval = setInterval(() => {
      if (currentUser.emailVerified) {
        navigate("/dashboard");
      } else {
        window.location.reload();
      }
    }, 10000);
    return () => clearInterval(isUserVerifiedInterval);
  }, [currentUser]);

  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (sending) {
    return <p>Sending...</p>;
  }

  return (
    <div>
      <Typography variant="body1">
        Nie zweryfikowałeś jeszcze swojego maila, zrób to aby uzyskać pełen
        dostęp do strony...
      </Typography>
      <Button
        variant="contained"
        onClick={async () => {
          const success = await sendEmailVerification();
          if (success) {
            alert("Sent email");
          }
        }}
      >
        Wyślij ponownie
      </Button>
      <Button variant="contained" onClick={() => window.location.reload()}>
        Gotowe
      </Button>
      <SignOutBtn />
    </div>
  );
}

export default Unverified;
