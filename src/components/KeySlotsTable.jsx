import React, { useEffect } from "react";
import { useState } from "react";

import { ContentPaste, Edit } from "@mui/icons-material";
import {
  Button,
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

import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";

const dataTest = [
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
  const [data, setData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [cardsData, setCardsData] = useState([]);

  const handleTest = async () => {
    const keyboxesRef = collection(db, "keyboxes");
    const slotsRef = collection(db, "slots");
    const cardsRef = collection(db, "cards");

    const keyboxQuery = query(
      keyboxesRef,
      where("deviceId", "==", "123456789")
    );

    const getData = async () => {
      const keyboxSnapshot = await getDocs(keyboxQuery);

      // array containing slots in keybox ex [1,2,3,4]
      // using docs[0] because it should always return one keybox
      const keyboxSlots = keyboxSnapshot.docs[0].data().slots;

      const slotQuery = query(slotsRef, where("slotId", "in", keyboxSlots));
      const slotSnapshot = await getDocs(slotQuery);

      setSlotsData([]);
      const slotsDataArray = slotSnapshot.docs.map((doc) => doc.data());
      setSlotsData(slotsDataArray);

      // returns all cards arrays
      const slotCardsArray = slotsDataArray.map((slot) => {
        if (slot.cards.length <= 0) {
          // if there are no cards return array with -1
          return [-1];
        } else {
          return slot.cards;
        }
      });

      const cardsQueries = slotCardsArray.map((cards) =>
        query(cardsRef, where("cardId", "in", cards))
      );

      setCardsData([]);
      let cardsDataTemp = [];
      for (const cardsQuery of cardsQueries) {
        const cardsSnapshot = await getDocs(cardsQuery);
        // push one slot's cards to array of all slot's cards
        cardsDataTemp.push(cardsSnapshot.docs.map((card) => card.data()));
      }

      setCardsData(cardsDataTemp);
    };
    getData();
  };

  return (
    // <TableContainer component={CustomPaper} variant="outlined" sx={{ mb: 3 }}>
    //   <Table aria-label="key slot table">
    //     <TableHead>
    //       <TableRow>
    //         <CustomizedTableCell align="center">ID</CustomizedTableCell>
    //         <CustomizedTableCell>Name</CustomizedTableCell>
    //         <CustomizedTableCell>Authorized Cards</CustomizedTableCell>
    //         <CustomizedTableCell align="center">Events</CustomizedTableCell>
    //         <CustomizedTableCell align="center">Edit</CustomizedTableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {data.map((row) => (
    //         <TableRow key={row.id}>
    //           <CustomizedTableCell align="center">{row.id}</CustomizedTableCell>
    //           <CustomizedTableCell sx={{ minWidth: "32ch" }}>
    //             {row.slotName}
    //           </CustomizedTableCell>
    //           <CustomizedTableCell>
    //             <div
    //               style={{
    //                 maxHeight: "64px",
    //                 overflowY: "auto",
    //               }}
    //             >
    //               {row.authorizedCards.length <= 0 ? (
    //                 <span>add authorized cards</span>
    //               ) : (
    //                 row.authorizedCards.map((card, index) => (
    //                   <Chip
    //                     label={card}
    //                     variant="outlined"
    //                     sx={{
    //                       m: 1,
    //                       bgcolor: "lightGray",
    //                       borderColor: "secondary.contrastText",
    //                       fontSize: "1rem",
    //                       height: "48px",
    //                       borderRadius: "32px",
    //                     }}
    //                     key={index}
    //                   />
    //                 ))
    //               )}
    //             </div>
    //           </CustomizedTableCell>
    //           <CustomizedTableCell align="center" sx={{ width: "8ch" }}>
    //             <ContentPaste sx={{ fontSize: "2rem" }} />
    //           </CustomizedTableCell>
    //           <CustomizedTableCell align="center" sx={{ width: "8ch" }}>
    //             <Edit sx={{ fontSize: "2rem" }} />
    //           </CustomizedTableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
    <>
      <Button onClick={handleTest}>Test</Button>
    </>
  );
}

export default KeySlotsTable;
