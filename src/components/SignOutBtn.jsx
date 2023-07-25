import React, { useState } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Button, CircularProgress } from "@mui/material";
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
    <ListItem
      key={"Log Out"}
      disablePadding
      sx={{
        display: "block",
        backgroundColor: "primary.main",
        width: "10rem",
        borderRadius: 30,
      }}
    >
      <ListItemButton
        onClick={handleTogglePopUp}
        sx={{
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {<LogoutOutlinedIcon sx={{ color: "white" }} />}
        </ListItemIcon>
        <ListItemText
          primary="Log Out"
          sx={{ opacity: open ? 1 : 1, color: "white", ml: 2 }}
        >
          Log out
        </ListItemText>

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
      </ListItemButton>
    </ListItem>
  );
}

export default SignOutBtn;
