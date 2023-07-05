import { Button, Typography } from "@mui/material";
import {
  useAuthState,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { auth } from "../../backend/db";
import SignOutBtn from "../../components/SignOutBtn";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Unverified() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // Once every 10 seconds site refreshes to check if user verified email
  useEffect(() => {
    // Check before interval if user is still unverified
    if (!loading) {
      if (user.emailVerified) {
        navigate("/dashboard");
      }
    }

    const interval = setInterval(() => {
      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        window.location.reload();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user, loading]);

  const [sendEmailVerification, sending, errorSend] =
    useSendEmailVerification(auth);

  if (errorSend) {
    return (
      <div>
        <p>Error: {errorSend.message}</p>
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
