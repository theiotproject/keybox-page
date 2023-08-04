import React from "react";

import { Box, Typography } from "@mui/material";

import Cards from "./components/Cards";

function Dashboard2() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: "1em",
        marginTop: "1em",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gridTemplateRows: { md: "repeat(2, 1fr)" },
        gridTemplateAreas: {
          xs: `
        "keyboxes"
        "cards"
        "events"
        `,
          md: `
        "keyboxes events"
        "cards events"
        `,
        },
        maxHeight: { xs: "unset", md: "88vh" },
      }}
    >
      <Box
        sx={{
          gridArea: "keyboxes",
          bgcolor: "gray",
          overflow: "auto",
        }}
      >
        <Box sx={{ height: "300px", width: "300px", bgcolor: "red" }}></Box>
      </Box>
      <Box
        sx={{
          gridArea: "cards",
          overflow: "auto",
        }}
      >
        <Cards />
      </Box>
      <Box
        sx={{
          gridArea: "events",
          bgcolor: "gray",
          overflow: "auto",
        }}
      >
        <Box sx={{ height: "300px", width: "300px", bgcolor: "blue" }}></Box>
        <Box sx={{ height: "300px", width: "300px", bgcolor: "blue" }}></Box>
        <Box sx={{ height: "300px", width: "300px", bgcolor: "blue" }}></Box>
      </Box>
    </Box>
  );
}

export default Dashboard2;
