import React from "react";

import { Box, Stack, Typography } from "@mui/material";

import SearchBar from "src/components/SearchBar";
import ConfiguredCardChip from "src/pages/Cards/components/ConfiguredCardChip";
import CustomSmallSelect from "src/pages/Cards/components/CustomSmallSelect";
import PendingCardChip from "src/pages/Cards/components/PendingCardChip";

function Cards() {
  return (
    <>
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, m: 5 }}>
        Manage Cards
      </Typography>
      {/* pending cards box */}
      <Box
        sx={{
          border: "3px solid gray",
          borderRadius: "4px",
          paddingY: "1em",
          paddingX: "1.5em",
          marginBottom: 3,
        }}
      >
        <Typography component="h2" variant="h1" sx={{ fontSize: 30, mb: 3 }}>
          Pending
        </Typography>
        <Stack sx={{ flexDirection: { xs: "column", md: "row", gap: "8px" } }}>
          <PendingCardChip label="hej" />
          <PendingCardChip label="Nowa1" />
          <PendingCardChip label="hej2" />
        </Stack>
      </Box>
      {/* configured cards box */}
      <Box
        sx={{
          border: "3px solid gray",
          borderRadius: "4px",
          paddingY: "1em",
          paddingX: "1.5em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography component="h2" variant="h1" sx={{ fontSize: 30 }}>
            Cards
          </Typography>
          <Box sx={{ display: "flex", gap: "1em" }}>
            <SearchBar />
            <CustomSmallSelect />
          </Box>
        </Box>
        <Stack sx={{ flexDirection: { xs: "column", md: "row", gap: "8px" } }}>
          <ConfiguredCardChip label="hej" />
          <ConfiguredCardChip label="hejdjhasiodjhoas" />
          <ConfiguredCardChip label="hej" />
        </Stack>
      </Box>
    </>
  );
}

export default Cards;
