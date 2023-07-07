import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { Button, CircularProgress } from "@mui/material";

import { auth } from "backend/db";
import ErrorMsg from "components/ErrorMsg";

function SignOutBtn() {
  const navigate = useNavigate();
  const [signOut, loading, error] = useSignOut(auth);

  const handleSignOut = async () => {
    const success = await signOut();

    // If user was signed out successfully
    if (success) {
      navigate("/");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
  }

  return (
    <Button variant="contained" onClick={handleSignOut}>
      Wyloguj
    </Button>
  );
}

export default SignOutBtn;
