import React from "react";

import { Box, Stack, Typography } from "@mui/material";

import SearchBar from "src/components/SearchBar";
import ConfiguredCardChip from "src/pages/Cards/components/ConfiguredCardChip";
import CustomSmallSelect from "src/pages/Cards/components/CustomSmallSelect";
import PendingCardChip from "src/pages/Cards/components/PendingCardChip";

function Cards() {
  return (
    <div>
      <Box
        sx={{
          border: "3px solid gray",
          borderRadius: "4px",
          paddingY: "1em",
          paddingX: "1.5em",
          marginBottom: "1em",
        }}
      >
        <Box>
          <Typography
            component="h2"
            variant="h1"
            sx={{ fontSize: 30, mb: 3, textAlign: "center" }}
          >
            Pending Cards
          </Typography>
        </Box>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <PendingCardChip label="hej" />
          <PendingCardChip label="Nowa1" />
          <PendingCardChip label="hej2" />
          <PendingCardChip label="hej2" />
          <PendingCardChip label="hej2" />
          <PendingCardChip label="hej2" />
          <PendingCardChip label="hej2" />
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
            flexDirection: { xs: "column", xl: "row" },
          }}
        >
          <Typography component="h2" variant="h1" sx={{ fontSize: 30 }}>
            Configured Cards
          </Typography>
        </Box>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "auto",
            maxHeight: "200px",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((card, index) => (
            <ConfiguredCardChip
              cardName="nowa"
              cardId="1"
              cardGroup=""
              key={index}
            />
          ))}
        </Stack>
      </Box>
    </div>
  );
}

export default Cards;
