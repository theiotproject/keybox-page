import React, { useEffect, useState } from "react";

import { Box, Skeleton, Stack, Typography } from "@mui/material";

import SearchBar from "src/components/SearchBar";

import { collection, getDocs, query, where } from "firebase/firestore";

import ConfiguredCardChip from "./ConfiguredCardChip";
import CustomSmallSelect from "./CustomSmallSelect";

function ConfiguredCardsBox({ refreshCards, cardData, ...props }) {
  const [keyboxRef, setKeyboxRef] = useState();
  const [data, setData] = useState([]);
  const [isLoadingData, setLoadingData] = useState(false);

  const getData = async () => {
    setLoadingData(true);
    const cardsCollectionRef = collection(keyboxRef, "cards");
    const configuredCardsQuery = query(
      cardsCollectionRef,
      where("isPending", "==", false)
    );

    const configuredCardsSnapshot = await getDocs(configuredCardsQuery);

    const configuredCardsData = configuredCardsSnapshot.docs.map((doc) => doc);

    setData(configuredCardsData);
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
          Configured Cards
        </Typography>
        <Box sx={{ display: "flex", gap: "1em" }}>
          <SearchBar />
          <CustomSmallSelect />
        </Box>
      </Box>
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
                <ConfiguredCardChip
                  key={index}
                  cardData={card}
                  keyboxRef={keyboxRef}
                  refreshCards={refreshCards}
                />
              ))}
            </>
          ) : (
            <Typography>
              There are no configured cards for this keybox
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default ConfiguredCardsBox;
