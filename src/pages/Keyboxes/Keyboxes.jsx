import React from "react";

import { Button, Grid, Typography } from "@mui/material";

import KeySlotsTable from "src/components/KeySlotsTable";

function Keyboxes() {
  return (
    <>
      <Typography variant="h1" my={4}>
        Manage your KeyBox
      </Typography>
      <Grid container direction="row" my={4}>
        <Typography
          variant="h1"
          sx={{
            paddingRight: "1rem",
          }}
        >
          <Typography
            component="span"
            sx={{
              color: "secondary.contrastTextVariant",
              fontSize: "2rem",
              paddingRight: "1rem",
            }}
          >
            Name:
          </Typography>
          Office
        </Typography>
        <Button variant="outlined">Edit Name</Button>
      </Grid>

      <Typography
        sx={{
          color: "secondary.contrastTextVariant",
          fontSize: "2rem",
          paddingRight: "1rem",
        }}
      >
        KeySlots:
      </Typography>
      <KeySlotsTable />
    </>
  );
}

export default Keyboxes;
