import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";

import AddNewDevice from "src/components/AddNewDevice";
import DeviceCard from "src/components/DeviceCard";
import ErrorMsg from "src/components/ErrorMsg";
import LoadingScreen from "src/components/LoadingScreen";

import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Dashboard() {
  const { currentUser, error, loading } = useAuthProvider();
  const navigate = useNavigate();

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
        minHeight: "90vh",
        display: "flex",
        justifyContent: "flex-start",
        alignContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, m: 5 }}>
        Your Key Boxes
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <AddNewDevice />
        <DeviceCard />
        <DeviceCard />
      </Box>
    </Container>
  );
}

export default Dashboard;
