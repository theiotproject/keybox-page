import React from "react";

import { Chip } from "@mui/material";

function CardChip({ label }) {
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        m: 1,
        bgcolor: "lightGray",
        borderColor: "secondary.contrastText",
        fontSize: "1rem",
        height: "48px",
        borderRadius: "32px",
      }}
    />
  );
}

export default CardChip;
