import * as React from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { Grid } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          display="flex"
          alignItems="center"
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Typography variant="h3" component="div" textAlign="center">
              Key Box Admin Panel
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
