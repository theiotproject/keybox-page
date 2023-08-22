import React, { useEffect } from "react";
import { useState } from "react";

import { Box, Skeleton, Stack, Typography } from "@mui/material";

import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import PendingCardChip from "./PendingCardChip";

function PendingCardsBox({ refreshCards, ...props }) {
  const [keyboxRef, setKeyboxRef] = useState();
  const [data, setData] = useState([]);
  const [isLoadingData, setLoadingData] = useState(false);

  const fetchPendingCards = async (keyboxId) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

    const myInit = {
      method: "GET",
      headers: myHeaders,
    };

    // checks only for events from last hour
    const response = await fetch(
      `https://api.golioth.io/v1/projects/keybox/devices/${keyboxId}/stream?interval=1h&encodedQuery=%7B%22fields%22%3A%20%5B%7B%22path%22%3A%20%22time%22%2C%22type%22%3A%20%22%22%7D%2C%7B%22path%22%3A%20%22deviceId%22%2C%22type%22%3A%20%22%22%7D%2C%7B%22path%22%3A%22newCard%22%2C%22type%22%3A%20%22%22%7D%5D%7D`,
      myInit
    )
      .catch((error) => {
        showError(
          `Error while sending query to Golioth, check console for more info`
        );
        console.error(error);
        return;
      })
      .then((response) => {
        return response.json();
      });

    return response;
  };

  const checkForPendingCards = async () => {
    const keyboxDoc = await getDoc(keyboxRef);

    const { list } = await fetchPendingCards(keyboxDoc.data().keyboxId);

    if (list && list.length > 0) {
      const addNewCard = async (cardId) => {
        const cardsCollectionRef = collection(keyboxRef, "cards");

        const newCardData = {
          cardName: `newCard: ${cardId.split(",")[1]}`,
          isPending: true,
        };

        await setDoc(
          doc(cardsCollectionRef, cardId.split(",")[1]),
          newCardData
        );
      };

      list.forEach(async (card, index) => {
        const checkIfCardIsAlreadyPending = async (card) => {
          const cardsCollectionRef = collection(keyboxRef, "cards");

          const isCardAlreadyPendingQuery = query(
            cardsCollectionRef,
            where(documentId(), "==", card.newCard.split(",")[1])
          );

          const isCardAlreadyPending = await getDocs(isCardAlreadyPendingQuery)
            .then((response) => {
              return response.docs.length > 0;
            })
            .catch((err) => console.error(err));

          return isCardAlreadyPending;
        };

        const isCardAlreadyPending = await checkIfCardIsAlreadyPending(card);

        if (!isCardAlreadyPending) {
          addNewCard(card.newCard);
        }
      });
    }
  };

  const getData = async () => {
    setLoadingData(true);
    const cardsCollectionRef = collection(keyboxRef, "cards");
    const pendingCardsQuery = query(
      cardsCollectionRef,
      where("isPending", "==", true)
    );

    const pendingCardsSnapshot = await getDocs(pendingCardsQuery);

    const pendingCardsData = pendingCardsSnapshot.docs.map((doc) => doc);

    setData(pendingCardsData);
    setLoadingData(false);
  };

  useEffect(() => {
    setKeyboxRef(props.keyboxRef);
  }, [props.keyboxRef]);

  useEffect(() => {
    if (keyboxRef) {
      checkForPendingCards(keyboxRef);
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
                <PendingCardChip
                  key={index}
                  cardData={card}
                  keyboxRef={keyboxRef}
                  refreshCards={refreshCards}
                />
              ))}
            </>
          ) : (
            <Typography>There are no pending cards for this keybox</Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default PendingCardsBox;
