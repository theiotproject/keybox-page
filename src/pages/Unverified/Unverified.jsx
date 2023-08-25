import { useEffect } from "react";
import {
  useAuthState,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import LeftSide from "src/components/LeftSide";
import LeftSideMobile from "src/components/LeftSideMobile";
import SignOutBtn from "src/components/SignOutBtn";

import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Unverified() {
  const { currentUser } = useAuthProvider();
  const navigate = useNavigate();

  // Once every 10 seconds site refreshes to check if user verified email
  useEffect(() => {
    // Check before interval if user is still unverified
    if (
      currentUser?.emailVerified ||
      currentUser?.providerData[0].providerId === "google.com"
    ) {
      navigate("/dashboard");
    }

    const isUserVerifiedInterval = setInterval(() => {
      if (
        currentUser.emailVerified ||
        currentUser?.providerData[0].providerId === "google.com"
      ) {
        navigate("/dashboard");
      } else {
        window.location.reload();
      }
    }, 20000);

    // console.log(currentUser);
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
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <LeftSide />
        <LeftSideMobile />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "2em",
            paddingX: "3em",
          }}
        >
          <Typography component="h1" variant="h1">
            Almost there!
          </Typography>
          <Typography component="h2" variant="h2">
            {currentUser?.displayName}, check your inbox and verify your
            account.
          </Typography>
          <Box
            sx={{
              marginTop: "3em",
              display: "grid",
              placeItems: "center",
              gap: "1em",
            }}
          >
            <Typography>You can't find the message in your inbox?</Typography>
            <Button
              variant="contained"
              onClick={async () => {
                const success = await sendEmailVerification();
                if (success) {
                  alert("Sent email");
                }
              }}
            >
              Send Again
            </Button>
          </Box>
          <Box sx={{ display: "grid", placeItems: "center", gap: "1em" }}>
            <Typography>You have already verified your email?</Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Take me to the dashboard
            </Button>
          </Box>
        </Box>
      </Box>

      <SignOutBtn />
    </>
  );
}

export default Unverified;
