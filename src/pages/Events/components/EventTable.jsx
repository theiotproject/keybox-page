import React from "react";

import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function EventTable() {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
      <Table aria-label="key slot table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Slot</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Card</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3].map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventTable;
