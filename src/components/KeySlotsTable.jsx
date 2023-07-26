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
import { styled } from "@mui/material/styles";

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

const CustomizedTableCell = styled(TableCell)`
  font-size: 1.3rem;
  border: 1px solid black;
`;

const CustomPaper = styled(Paper)`
  border: 0;
  border-radius: 0px;
`;

function KeySlotsTable() {
  return (
    <TableContainer component={CustomPaper} variant="outlined" sx={{ mb: 3 }}>
      <Table aria-label="key slot table">
        <TableHead>
          <TableRow>
            <CustomizedTableCell align="center">ID</CustomizedTableCell>
            <CustomizedTableCell>Name</CustomizedTableCell>
            <CustomizedTableCell>Authorized Cards</CustomizedTableCell>
            <CustomizedTableCell align="center">Events</CustomizedTableCell>
            <CustomizedTableCell align="center">Edit</CustomizedTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <CustomizedTableCell align="center">{row.id}</CustomizedTableCell>
              <CustomizedTableCell sx={{ minWidth: "32ch" }}>
                {row.slotName}
              </CustomizedTableCell>
              <CustomizedTableCell>
                <div
                  style={{
                    maxHeight: "64px",
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
                          fontSize: "1rem",
                          height: "48px",
                          borderRadius: "32px",
                        }}
                        key={card}
                      />
                    ))
                  )}
                </div>
              </CustomizedTableCell>
              <CustomizedTableCell align="center" sx={{ width: "8ch" }}>
                <ContentPaste sx={{ fontSize: "2rem" }} />
              </CustomizedTableCell>
              <CustomizedTableCell align="center" sx={{ width: "8ch" }}>
                <Edit sx={{ fontSize: "2rem" }} />
              </CustomizedTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default KeySlotsTable;
