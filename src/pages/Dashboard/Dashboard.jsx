import { Typography } from "@mui/material";
import SignOutBtn from "../../components/SignOutBtn";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../backend/db";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (error) {
    return <p>Error {error}</p>;
  }

  if (!user) {
    navigate("/signin");
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
