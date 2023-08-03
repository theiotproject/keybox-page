import React, { useEffect, useState } from "react";

import { Box, Stack, Typography } from "@mui/material";

import SearchBar from "src/components/SearchBar";
import ConfiguredCardChip from "src/pages/Cards/components/ConfiguredCardChip";
import CustomSmallSelect from "src/pages/Cards/components/CustomSmallSelect";
import PendingCardChip from "src/pages/Cards/components/PendingCardChip";

import { collection, getDocs } from "firebase/firestore";
import { db } from "src/backend/db_config";

function Cards() {
  const [itemListArray, setItemListArray] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  useEffect(() => {
    const getCardsData = async () => {
      const cardsCollectionRef = collection(db, "cards");
      const cardsSnapshot = await getDocs(cardsCollectionRef);
      setCardsData(cardsSnapshot.docs);

      console.log(cardsSnapshot.docs[0]);
    };

    getCardsData();
  }, []);

  // useEffect(() => {

  // },[])

  return (
    <>
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, m: 5 }}>
        Manage Cards
      </Typography>
      {/* pending cards box */}
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
          <PendingCardChip label="hej" />
          <PendingCardChip label="Nowa1" />
          <PendingCardChip label="hej2" />
        </Stack>
      </Box>
      {/* configured cards box */}
      <Box
        sx={{
          border: "3px solid gray",
          borderRadius: "4px",
          paddingY: "1em",
          paddingX: "1.5em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            mb: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Typography component="h2" variant="h1" sx={{ fontSize: 30 }}>
            Cards
          </Typography>
          <Box sx={{ display: "flex", gap: "1em" }}>
            <SearchBar
              itemListArray={["admin", "moderator", "forklift operator"]}
              setFilteredResults={setFilteredResults}
            />
            <CustomSmallSelect />
          </Box>
        </Box>
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
          {cardsData.map((card) => (
            <ConfiguredCardChip
              label={card.data().cardName}
              key={card.data().cardName}
            />
          ))}
        </Stack>
      </Box>
    </>
  );
}

export default Cards;
