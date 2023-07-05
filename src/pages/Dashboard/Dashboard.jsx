import { Typography } from "@mui/material";
import SignOutBtn from "../../components/SignOutBtn";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../backend/db";
import ErrorMsg from "../../components/ErrorMsg";
import LoadingScreen from "../../components/LoadingScreen";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
  }

  // If user tries to access this page without beeing signed, they are redirected to sign in page
  if (!user) {
    navigate("/signin");
  }

  if (!user.emailVerified) {
    navigate("/unverified");
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Typography component="h1" variant="h3">
        Cześć: {auth.currentUser.email}
      </Typography>
      <SignOutBtn />
    </div>
  );
}

export default Dashboard;
