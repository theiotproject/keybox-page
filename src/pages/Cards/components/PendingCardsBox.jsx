import React, { useEffect } from "react";
import { useState } from "react";

import { Box, Skeleton, Stack, Typography } from "@mui/material";

import { collection, getDocs, query, where } from "firebase/firestore";

import PendingCardChip from "./PendingCardChip";

function PendingCardsBox(props) {
  const [keyboxRef, setKeyboxRef] = useState();
  const [data, setData] = useState([]);
  const [isLoadingData, setLoadingData] = useState(false);

  const getData = async () => {
    setLoadingData(true);
    const cardsCollectionRef = collection(keyboxRef, "cards");
    const pendingCardsQuery = query(
      cardsCollectionRef,
      where("isPending", "==", true)
    );

    const pendingCardsSnapshot = await getDocs(pendingCardsQuery);

    const pendingCardsData = pendingCardsSnapshot.docs.map((doc) => doc.data());

    setData(pendingCardsData);
    setLoadingData(false);
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
    <Box
      sx={{
        border: "3px solid gray",
        borderRadius: "4px",
        paddingY: "1em",
        paddingX: "1.5em",
        marginBottom: 3,
      }}
    >
      <Typography component="h2" variant="h1" sx={{ fontSize: 30, mb: 3 }}>
        Pending
      </Typography>
      {isLoadingData ? (
        <>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      ) : (
        <Stack
          sx={{
            flexDirection: {
              xs: "column",
              md: "row",
              gap: "8px",
              flexWrap: "wrap",
            },
          }}
        >
          {data.length > 0 ? (
            <>
              {data.map((card, index) => (
                <PendingCardChip key={index} label={card?.cardName} />
              ))}
            </>
          ) : (
            <Typography>There are no pending cards</Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default PendingCardsBox;
