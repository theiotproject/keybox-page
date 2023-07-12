import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";

import AddNewDevice from "src/components/AddNewDevice";
import DeviceCard from "src/components/DeviceCard";
import ErrorMsg from "src/components/ErrorMsg";
import LoadingScreen from "src/components/LoadingScreen";
import SignOutBtn from "src/components/SignOutBtn";
import Container from "@mui/material/Container";

import { auth } from "src/backend/db";
import { useAuthProvider } from "src/contexts/AuthContext";

function Dashboard() {
  const { currentUser, error, loading } = useAuthProvider();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(currentUser);
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
  }

  // If user tries to access this page without beeing signed, they are redirected to sign in page
  if (!currentUser) {
    navigate("/signin");
  }

  if (!currentUser.emailVerified) {
    navigate("/unverified");
  }

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center"
      }}
    >
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, mt:10}}>
        Your Key Boxes
      </Typography>
      <div style={{ display: "flex", flexWrap: 'wrap', width: '100%', justifyContent: 'center'}}>
        <AddNewDevice />
        <DeviceCard />
        <DeviceCard />
      </div>
      <SignOutBtn />
    </Container>
  );
}

export default Dashboard;
