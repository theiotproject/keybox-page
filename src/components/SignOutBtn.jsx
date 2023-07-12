import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import React from "react";
import { Button, CircularProgress } from "@mui/material";

import ErrorMsg from "src/components/ErrorMsg";

import { auth } from "src/backend/db_config";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

function SignOutBtn() {
  const navigate = useNavigate();
  const [signOut, loading, error] = useSignOut(auth);
  const [open, setOpen] = React.useState(false);

  const handlePopUp = () => {
    setOpen(!open);
  };

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
       <Box>
        <Button variant="contained" onClick={handlePopUp}>
          <LogoutOutlinedIcon />
        </Button>

        <Dialog open={open} onClose={handlePopUp}>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogActions>
          <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant="outlined" onClick={handlePopUp} sx={{m:1}}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSignOut} sx={{m:1}}>
              Log Out 
            </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Box> 
    );
  };


export default SignOutBtn;
