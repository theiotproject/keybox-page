import React, { useEffect } from "react";
import { useState } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";

import Events from "./components/Events";
import KeyboxCard from "./components/KeyboxCard";

import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { currentUser } = useAuthProvider();

  useEffect(() => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxCollectionRef = collection(userDocRef, "keyboxes");

    const keyboxQuery = query(keyboxCollectionRef);
    const unsubscribe = onSnapshot(keyboxQuery, (snapshot) => {
      // Clear data to prevent data duplication of data,
      // which appears because onSnapshot runs every time user activates window
      // or does any action connected with data
      setData([]);
      snapshot.docs.forEach((doc) => {
        setData((prevData) => [
          ...prevData,
          { docRef: doc.ref, ...doc.data() },
        ]);
      });
      setLoading(false);
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "80vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              overflowX: "scroll",
              maxHeight: "fit-content",
            }}
          >
            {data &&
              data.map((item, index) => (
                <KeyboxCard
                  key={index}
                  docRef={item.docRef}
                  keyboxId={item.keyboxId}
                  keyboxName={item.keyboxName}
                />
              ))}
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
