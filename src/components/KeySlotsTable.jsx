import React, { useEffect } from "react";

import { ContentPaste, Edit } from "@mui/icons-material";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const data = [
  {
    id: 1,
    slotName: "New Slot",
    authorizedCards: [
      "Aaaaaaaaaaa",
      "Bbbbbbbbb",
      "Cccccccccc",
      "Dddddddddddddddd",
      "Aaaaaaaaaaa",
      "Bbbbbbbbb",
      "Cccccccccc",
      "Dddddddddddddddd",
      "Aaaaaaaaaaa",
      "Bbbbbbbbb",
      "Cccccccccc",
      "Dddddddddddddddd",
      "Aaaaaaaaaaa",
      "Bbbbbbbbb",
      "Cccccccccc",
      "Dddddddddddddddd",
    ],
  },
  {
    id: 2,
    slotName: "New Slot #2",
    authorizedCards: ["A"],
  },
  {
    id: 3,
    slotName: "New Slot #3",
    authorizedCards: ["A", "B", "C"],
  },
  {
    id: 4,
    slotName: "New Slot #4",
    authorizedCards: [],
  },
];

function KeySlotsTable() {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="key slot table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Authorized Cards</TableCell>
            <TableCell>Events</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell sx={{ minWidth: "32ch" }}>{row.slotName}</TableCell>
              <TableCell>
                <div
                  style={{
                    maxHeight: "100px",
                    overflowY: "auto",
                  }}
                >
                  {row.authorizedCards.length <= 0 ? (
                    <span>add authorized cards</span>
                  ) : (
                    row.authorizedCards.map((card) => (
                      <Chip
                        label={card}
                        variant="outlined"
                        sx={{
                          m: 1,
                          bgcolor: "lightGray",
                          borderColor: "secondary.contrastText",
                        }}
                        key={card}
                      />
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ContentPaste />
              </TableCell>
              <TableCell>
                <Edit />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default KeySlotsTable;
