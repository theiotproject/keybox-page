import React, { useEffect, useState } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import { collection, getDocs } from "firebase/firestore";

function CardSlotsTable({ cardId }) {
  const [slotsData, setSlotsData] = useState();
  const [isLoading, setLoading] = useState(false);

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ marginY: 3 }}>
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
  );
}

export default CardSlotsTable;
