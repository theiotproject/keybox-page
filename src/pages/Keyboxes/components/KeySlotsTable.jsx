import React, { useEffect } from "react";
import { useState } from "react";

import { Add, ContentPaste, Edit } from "@mui/icons-material";
import {
  Button,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CardChip from "src/pages/Keyboxes/components/CardChip";

import { collection, getDocs } from "firebase/firestore";

const CustomizedTableCell = styled(TableCell)`
  font-size: 1.3rem;
  border: 1px solid black;
`;

const CustomPaper = styled(Paper)`
  border: 0;
  border-radius: 0px;
`;

function KeySlotsTable(props) {
  const [keyboxRef, setKeyboxRef] = useState();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState([]);

  const getData = async () => {
    setLoading(true);
    const slotsCollectionRef = collection(keyboxRef, "slots");
    const cardsCollectionRef = collection(keyboxRef, "cards");
    const slotsSnapshot = await getDocs(slotsCollectionRef);
    const cardsSnapshot = await getDocs(cardsCollectionRef);

    const slotsData = slotsSnapshot.docs.map((doc) => doc);
    const cardsData = cardsSnapshot.docs.map((doc) => doc);

    const combinedData = slotsData.map((slot) => {
      return {
        slotId: slot.id,
        slotName: slot.data().slotName,
        authorizedCards: cardsData.filter((card) => {
          return slot.data().authorizedCards.includes(Number(card.id));
        }),
      };
    });

    const combinedDataFixed = combinedData.map((item) => {
      return {
        slotId: item.slotId,
        slotName: item.slotName,
        authorizedCards: item.authorizedCards.map((card) => card.data()),
      };
    });

    setData(combinedDataFixed);
    setLoading(false);
  };

  const addNewKeyboxSlot = async () => {
    const slotsCollectionRef = collection(keyboxRef, "slots");
  };

  useEffect(() => {
    setKeyboxRef(props.keyboxRef);
  }, [props.keyboxRef]);

  useEffect(() => {
    if (keyboxRef) {
      getData();
    }
  }, [keyboxRef]);

  return (
    <>
      <TableContainer component={CustomPaper} variant="outlined" sx={{ mb: 3 }}>
        <Table aria-label="key slot table">
          <TableHead>
            <TableRow>
              <CustomizedTableCell align="center" sx={{ width: "2ch" }}>
                ID
              </CustomizedTableCell>
              <CustomizedTableCell sx={{ minWidth: "32ch" }}>
                Name
              </CustomizedTableCell>
              <CustomizedTableCell>Authorized Cards</CustomizedTableCell>
              <CustomizedTableCell align="center" sx={{ width: "8ch" }}>
                Events
              </CustomizedTableCell>
              <CustomizedTableCell align="center" sx={{ width: "8ch" }}>
                Edit
              </CustomizedTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <>
                {[1, 2, 3].map((row, index) => (
                  <TableRow key={index}>
                    <CustomizedTableCell align="center">
                      <Skeleton animation="wave" />
                    </CustomizedTableCell>
                    <CustomizedTableCell sx={{ minWidth: "32ch" }}>
                      <Skeleton animation="wave" />
                    </CustomizedTableCell>
                    <CustomizedTableCell>
                      <div>
                        <Skeleton animation="wave" />
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
              </>
            )}
            {!isLoading && data.length == 0 && (
              <TableRow>
                <CustomizedTableCell sx={{ width: "8ch" }} colSpan={5}>
                  <Typography>Brak dodanych slotów</Typography>
                </CustomizedTableCell>
              </TableRow>
            )}
            {!isLoading &&
              data.length > 0 &&
              data.map((row) => (
                <TableRow key={row.slotId}>
                  <CustomizedTableCell align="center">
                    {row.slotId}
                  </CustomizedTableCell>
                  <CustomizedTableCell>{row.slotName}</CustomizedTableCell>
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
                          <CardChip label={card.cardName} key={index} />
                        ))
                      )}
                    </div>
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    <ContentPaste sx={{ fontSize: "2rem" }} />
                  </CustomizedTableCell>
                  <CustomizedTableCell align="center">
                    <Edit sx={{ fontSize: "2rem" }} />
                  </CustomizedTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "2rem",
          alignItems: "center",
        }}
      >
        <Button
          sx={{ fontSize: "1.5rem" }}
          variant="text"
          onClick={() => addNewKeyboxSlot()}
        >
          <Add sx={{ fontSize: "2rem" }} />
          Dodaj nowy
        </Button>
      </Grid>
    </>
  );
}

export default KeySlotsTable;
