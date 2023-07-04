import { Button } from "@mui/material";
import { auth } from "../backend/db";
import { useNavigate } from "react-router-dom";

function SignOutBtn() {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      auth.signOut(auth);
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error: ${errorCode} - ${errorMessage}`);
    }
  };
  return (
    <Button variant="contained" onClick={handleSignOut}>
      Wyloguj
    </Button>
  );
}

export default SignOutBtn;
