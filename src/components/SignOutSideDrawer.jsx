import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoutOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

function SignOutSideDrawer({ isExpanded }) {
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
      <ListItem disablePadding sx={{ display: "block", pb: 0 }}>
        <ListItemButton
          onClick={handleTogglePopUp}
          sx={{
            minHeight: 48,
            justifyContent: isExpanded ? "initial" : "center",
            px: 2.5,
            bgcolor: "primary.main",
            "&:focus-within": { bgcolor: "white" },
            "&:focus-within > *": {
              color: "primary.main",
            },
            "&:hover": { bgcolor: "white" },
            "&:hover > *": {
              color: "primary.main",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isExpanded ? 3 : "auto",
              justifyContent: "center",
              color: "white",
            }}
          >
            {<LogoutOutlined />}
          </ListItemIcon>
          <ListItemText
            primary={"Log Out"}
            sx={{
              opacity: isExpanded ? 1 : 0,
              color: "white",
            }}
          />
        </ListItemButton>
      </ListItem>
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

export default SignOutSideDrawer;
