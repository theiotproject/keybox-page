import React from "react";

import { Box, Typography } from "@mui/material";

import EventTable from "./components/EventTable";

function Events() {
  return (
    <>
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, m: 5 }}>
        Events
      </Typography>
      <Box>
        <EventTable />
      </Box>
    </>
  );
}

export default Events;
