import React, { useEffect, useState } from "react";

import { Add, AddCard, Close, CreditCard } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import styled from "@emotion/styled";

import EditPendingCardDialog from "./EditPendingCardDialog";

function PendingCardChip({ cardData, size = 1.6, refreshCards, ...props }) {
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

  const [open, setOpen] = useState(false);
  const [keyboxRef, setKeyboxRef] = useState();

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleClickCard = () => {
    setOpen(true);
    console.info("You clicked the Chip.");
  };

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  useEffect(() => {
    setKeyboxRef(props.keyboxRef);
  }, [props.keyboxRef]);

  return (
    <>
      <StyledChip
        sx={{
          height: `${size * 32}px`,
          display: "flex",
          justifyContent: "space-between",
        }}
        label={cardData.data().cardName}
        variant="outlined"
        onClick={handleClickCard}
        onDelete={handleDelete}
        icon={<CreditCard />}
      />
      <EditPendingCardDialog
        open={open}
        toggleDialog={handleDialogToggle}
        cardData={cardData}
        keyboxRef={keyboxRef}
        refreshCards={refreshCards}
      />
    </>
  );
}

export default PendingCardChip;
