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

import CustomFormSelect from "src/pages/Cards/components/CustomFormSelect";

import styled from "@emotion/styled";
import useKeyboxData from "src/util/services/useKeyboxData";
import useSlotsData from "src/util/services/useSlotsData";

function PendingCardChip({ label, size = 1.6 }) {
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
  const [isLoading, setLoading] = useState(false);

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleClickCard = () => {
    setOpen(true);
    console.info("You clicked the Chip.");
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  return (
    <>
      <StyledChip
        sx={{
          height: `${size * 32}px`,
          display: "flex",
          justifyContent: "space-between",
        }}
        label={label}
        variant="outlined"
        onClick={handleClickCard}
        onDelete={handleDelete}
        icon={<CreditCard />}
      />
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit device</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleDialogClose}>
          <DialogTitle
            sx={{
              fontSize: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Configure Pending Card
            <AddCard sx={{ fontSize: "3em" }} />
          </DialogTitle>
          <DialogContent
            sx={{
              marginX: { xs: "unset", sm: "4em" },
            }}
          >
            <Box
              component="form"
              noValidate
              sx={{
                display: "grid",
                placeItems: "center",
              }}
              //   onSubmit={handleSubmit(handleEditDevice)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="cardId"
                name="cardId"
                label="Card Id"
                defaultValue=""
                // {...register("cardId")}
                // error=""
                helperText=""
                fullWidth
                variant="outlined"
                sx={{ mt: 2, width: "100%" }}
                disabled
              />
              <TextField
                autoFocus
                margin="dense"
                id="cardName"
                name="cardName"
                label="Card Name"
                defaultValue=""
                // {...register("cardName")}
                // error=""
                helperText=""
                fullWidth
                variant="outlined"
                sx={{ mt: 2, width: "100%" }}
              />

              <CustomFormSelect />

              {/* Add to slots table */}

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ marginY: 3 }}
              >
                <Table aria-label="key slot table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="center">Authorize?</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading &&
                      [1, 2, 3].map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">ID</TableCell>
                          <TableCell sx={{ minWidth: "32ch" }}>Slot</TableCell>
                          <TableCell align="center">
                            <Checkbox size="medium" />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <DialogActions
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  columnGap: ".5em",
                }}
                disableSpacing
              >
                <Button
                  aria-label="delete"
                  startIcon={<Close />}
                  color="error"
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                >
                  Dismiss Card
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                  startIcon={<Add />}
                >
                  Add Card
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleDialogClose}
                  sx={{
                    gridColumn: { sm: "1/-1" },
                    width: "100%",
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default PendingCardChip;
