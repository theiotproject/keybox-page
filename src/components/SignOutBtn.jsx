import React, { useState } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Button, CircularProgress, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

function SignOutBtn() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleTogglePopUp = () => {
    setOpen(!open);
  };

  const handleSignOut = async () => {
    navigate("/signout");
  };

  return (
    <>
      <Button
        aria-label="sign out"
        sx={{
          background: "#00618A",
          padding: ".5rem",
          position: "absolute",
          right: "10px",
          bottom: "10px",
          ":hover": { background: "hsl(197.8,100%,25.1%)" },
        }}
        onClick={handleTogglePopUp}
      >
        <LogoutOutlinedIcon sx={{ color: "white" }} />
      </Button>

      <Dialog open={open} onClose={handleTogglePopUp}>
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogActions>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleTogglePopUp}
              sx={{ m: 1 }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSignOut} sx={{ m: 1 }}>
              Log Out
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SignOutBtn;
