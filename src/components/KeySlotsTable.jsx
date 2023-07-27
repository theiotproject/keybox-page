import React, { useEffect, useLayoutEffect } from "react";
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
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";

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
  const [isLoading, setLoading] = useState([]);

  const getData = async () => {
    const getSlotsData = async () => {
      const keyboxesRef = collection(db, "keyboxes");
      const slotsRef = collection(db, "slots");

      const keyboxQuery = query(
        keyboxesRef,
        where("deviceId", "==", "123456789")
      );

      const keyboxSnapshot = await getDocs(keyboxQuery);

      // array containing slots in keybox ex [1,2,3,4]
      // using docs[0] because it should always return one keybox
      console.log(keyboxSnapshot);
      const keyboxSlots = keyboxSnapshot.docs[0].data().slots;

      const slotQuery = query(slotsRef, where("slotId", "in", keyboxSlots));
      const slotSnapshot = await getDocs(slotQuery);

      const slotsDataArray = slotSnapshot.docs.map((doc) => doc.data());

      return slotsDataArray;
    };

    const getCardsData = async (slotsDataArray) => {
      const cardsRef = collection(db, "cards");
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

      const cardsDataPromises = await cardsQueries.map(async (cardQuery) => {
        const cardsSnapshot = await getDocs(cardQuery);

        // push one slot's cards to array of all slot's cards
        return cardsSnapshot.docs.map((card) => card.data());
      });

      const cardsDataTemp = await Promise.all(cardsDataPromises);

      return cardsDataTemp;
    };

    const combineData = (slotsData, cardsData) => {
      const combinedData = slotsData.map((slot, index) => {
        return {
          slotId: slot.slotId,
          slotName: slot.slotName,
          authorizedCards: cardsData[index],
        };
      });

      return combinedData;
    };

    const slotsDataTemp = await getSlotsData();
    const cardsDataTemp = await getCardsData(slotsDataTemp);

    const combinedData = combineData(slotsDataTemp, cardsDataTemp);
    // sort data by slotId
    combinedData.sort((prev, next) => prev.slotId - next.slotId);
    setData(combinedData);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
            <TableRow key={row.slotId}>
              <CustomizedTableCell align="center">
                {row.slotId}
              </CustomizedTableCell>
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
                    row.authorizedCards.map((card, index) => (
                      <Chip
                        label={card.cardName}
                        variant="outlined"
                        sx={{
                          m: 1,
                          bgcolor: "lightGray",
                          borderColor: "secondary.contrastText",
                          fontSize: "1rem",
                          height: "48px",
                          borderRadius: "32px",
                        }}
                        key={index}
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
