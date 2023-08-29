import React, { useEffect, useState } from "react";

import { CreditCard } from "@mui/icons-material";
import { Chip } from "@mui/material";

import showError from "src/components/Toasts/ToastError";

import styled from "@emotion/styled";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { addUserEvent } from "src/util/services/addUserEvent";

function SimplePendingCardChip({ cardData, size = 1.6, ...props }) {
  const StyledChip = styled(Chip)(() => ({
    "& .MuiChip-label": {
      fontSize: `${size * 0.8125}rem`,
    },
    "& .MuiChip-deleteIcon": {
      height: `${size * 22}px`,
      width: `${size * 22}px`,
    },
    "& .MuiChip-icon": {
      height: `${size * 22}px`,
      width: `${size * 22}px`,
    },
  }));

  return (
    <StyledChip
      sx={{
        height: `${size * 32}px`,
        display: "flex",
        justifyContent: "flex-start",
        width: {
          xs: "100%",
          md: "48%",
        },
      }}
      label={cardData.data().cardName}
      variant="outlined"
      icon={<CreditCard />}
    />
  );
}

export default SimplePendingCardChip;
