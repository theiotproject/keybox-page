import React, { useEffect } from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";

import Events from "./components/Events";
import KeyboxCard from "./components/KeyboxCard";
import SimplePendingCardChip from "./components/SimplePendingCardChip";

import {
  collection,
  collectionGroup,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

Link;

function Dashboard() {
  const { currentUser } = useAuthProvider();
  const [dataKeyboxes, setDataKeyboxes] = useState([]);
  const [dataCards, setDataCards] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isCardsLoading, setCardsLoading] = useState(false);

  const fetchPendingCards = async (keyboxId) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

    const myInit = {
      method: "GET",
      headers: myHeaders,
    };

    // checks only for events from last minute
    const response = await fetch(
      `https://api.golioth.io/v1/projects/keybox/devices/${keyboxId}/stream?interval=1m&encodedQuery=%7B%20%20%20%22fields%22%3A%20%5B%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22time%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22deviceId%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22timestamp%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%2C%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22newCard%22%2C%20%20%20%20%20%20%20%22type%22%3A%20%22%22%20%20%20%20%20%7D%20%20%20%5D%2C%20%20%20%22filters%22%3A%20%5B%20%20%20%20%20%7B%20%20%20%20%20%20%20%22path%22%3A%20%22newCard%22%2C%20%20%20%20%20%20%20%22op%22%3A%20%22%3C%3E%22%2C%20%20%20%20%20%20%20%22value%22%3A%20%22null%22%20%20%20%20%20%7D%20%20%20%5D%20%7D`,
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

  const checkForPendingCards = async (keyboxRef) => {
    const keyboxDoc = await getDoc(keyboxRef);

    const { list } = await fetchPendingCards(keyboxDoc.data().keyboxId);

    if (list && list.length > 0) {
      const addNewCard = async (cardEvent) => {
        const cardsCollectionRef = collection(keyboxRef, "cards");

        const newCardData = {
          cardName: `newCard: ${cardEvent.split(",")[1]}`,
          isPending: true,
        };

        await setDoc(
          doc(cardsCollectionRef, cardEvent.split(",")[1]),
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

  const getAllPendingCards = async () => {
    setCardsLoading(true);
    setDataCards([]);
    const keyboxesRefs = dataKeyboxes.map((keybox) => keybox.docRef);

    let cardsSnapshotsArr = [];
    for (const keyboxRef of keyboxesRefs) {
      const cardsCollectionRef = collection(keyboxRef, "cards");
      checkForPendingCards(keyboxRef);
      const cardsQuery = query(
        cardsCollectionRef,
        where("isPending", "==", true)
      );

      const cardsSnapshots = await getDocs(cardsQuery);
      if (cardsSnapshots.docs.length > 0) {
        cardsSnapshotsArr.push(cardsSnapshots.docs);
      }
    }

    let cardsObjects = [];
    cardsSnapshotsArr.map((cardsSnapshot) => {
      cardsSnapshot.map((cardsSnapshotDocs) => {
        cardsObjects.push(cardsSnapshotDocs);
      });
    });
    setDataCards(cardsObjects);
    setLoading(false);
    setCardsLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxCollectionRef = collection(userDocRef, "keyboxes");

    const keyboxQuery = query(keyboxCollectionRef);
    const unsubscribeKeyboxes = onSnapshot(keyboxQuery, (snapshot) => {
      // Clear data to prevent data duplication of data,
      // which appears because onSnapshot runs every time user activates window
      // or does any action connected with data
      setDataKeyboxes([]);
      snapshot.docs.forEach((doc) => {
        setDataKeyboxes((prevData) => [
          ...prevData,
          { docRef: doc.ref, ...doc.data() },
        ]);
      });
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribeKeyboxes();
    };
  }, []);

  useEffect(() => {
    if (dataKeyboxes) {
      getAllPendingCards();
    }
  }, [dataKeyboxes]);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid
            sx={{
              marginY: 2,
              display: "flex",
              gap: "1em",
              width: "100%",
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            {/* Keyboxes */}
            <Grid
              sx={{
                flex: "1",
                maxWidth: {
                  xs: "100%",
                  md: "50%",
                },
                padding: ".25em 2em",
                border: "1px solid #B4B4B4",
                backgroundColor: "white",
                borderRadius: "12px",
                minHeight: "24rem",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                }}
              >
                <Typography
                  component="h1"
                  variant="h1"
                  sx={{ fontSize: 28, my: 1 }}
                >
                  KeyBoxes
                </Typography>
                <Button href="/keyboxes" variant="outlined">
                  Show all
                </Button>
              </Grid>
              {dataKeyboxes && dataKeyboxes.length > 0 ? (
                <Grid
                  container
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    flexDirection: "row",
                    overflowX: "auto",
                  }}
                >
                  {dataKeyboxes.map((item, index) => (
                    <KeyboxCard
                      key={index}
                      docRef={item.docRef}
                      keyboxId={item.keyboxId}
                      keyboxName={item.keyboxName}
                    />
                  ))}
                </Grid>
              ) : (
                <>
                  <Typography sx={{ color: "#555555", marginTop: 2 }}>
                    You don't have any KeyBoxes
                  </Typography>
                  <Typography sx={{ color: "#555555" }}>
                    -{" "}
                    <Link
                      component={RouterLink}
                      sx={{
                        color: "#004EDA",
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                      to="/keyboxes"
                    >
                      add one
                    </Link>
                  </Typography>
                </>
              )}
            </Grid>
            {/* Cards */}
            <Grid
              sx={{
                flex: "1",
                maxWidth: {
                  xs: "100%",
                  md: "50%",
                },
                padding: ".25em 2em",
                backgroundColor: "white",
                border: "1px solid #B4B4B4",
                borderRadius: "12px",
                minHeight: "24rem",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                }}
              >
                <Typography
                  component="h1"
                  variant="h1"
                  sx={{ fontSize: 28, my: 1 }}
                >
                  Pending Cards
                </Typography>
                <Grid sx={{ display: "flex", flexDirection: "row" }}>
                  <IconButton
                    aria-label="refresh pending cards"
                    onClick={() => {
                      getAllPendingCards();
                    }}
                  >
                    <Refresh />
                  </IconButton>
                  <Button href="/cards" variant="outlined">
                    Show all
                  </Button>
                </Grid>
              </Grid>
              {!isCardsLoading && dataCards && dataCards.length > 0 ? (
                <Grid
                  container
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: ".25em",
                    paddingY: "1em",
                  }}
                >
                  {dataCards.map((card, index) => (
                    <SimplePendingCardChip key={index} cardData={card} />
                  ))}
                </Grid>
              ) : (
                <>
                  {isCardsLoading ? (
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      height={"75%"}
                    >
                      <CircularProgress />
                    </Grid>
                  ) : (
                    <Typography sx={{ color: "#555555", marginTop: 2 }}>
                      There is no pending cards
                    </Typography>
                  )}
                </>
              )}
            </Grid>
          </Grid>
          <Grid>
            <Events />
          </Grid>
        </>
      )}
    </>
  );
}

export default Dashboard;
