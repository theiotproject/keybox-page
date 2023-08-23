import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Refresh } from "@mui/icons-material";
import { Grid, IconButton, MenuItem, Select, Typography } from "@mui/material";

import FirebaseEventsTable from "src/components/FirebaseEventsTable";
import GoliothEventsTable from "src/components/GoliothEventsTable";

import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Events() {
  const { currentUser } = useAuthProvider();
  const { keyboxParam } = useParams();

  const [keyboxesData, setKeyboxesData] = useState();
  const [selectedKeyboxData, setSelectedKeyboxData] = useState();
  const [selectedKeyboxName, setSelectedKeyboxName] = useState("");

  const [eventType, setEventType] = useState("accessEvents");

  const getKeyboxesData = async () => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxesCollectionRef = collection(userDocRef, "keyboxes");
    const keyboxSnapshot = await getDocs(keyboxesCollectionRef);
    const keyboxesData = keyboxSnapshot.docs;

    setKeyboxesData(keyboxesData);
  };

  const getKeyboxData = async (keyboxName) => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxesCollectionRef = collection(userDocRef, "keyboxes");

    const keyboxQuery = query(
      keyboxesCollectionRef,
      where("keyboxName", "==", keyboxName)
    );

    const keyboxSnapshot = await getDocs(keyboxQuery);
    const keyboxData = keyboxSnapshot.docs;

    // query is supposed to return only one document so it checks first index
    setSelectedKeyboxData({
      keyboxRef: keyboxData[0].ref,
      keyboxName: keyboxData[0].data().keyboxName,
      keyboxId: keyboxData[0].data().keyboxId,
    });
  };

  const handleChangeKeybox = (event) => {
    getKeyboxData(event.target.value);
    setSelectedKeyboxName(event.target.value);
  };

  const handleRefreshKeyboxes = (lastSelectedKeybox) => {
    setSelectedKeyboxName(lastSelectedKeybox);
    getKeyboxesData(lastSelectedKeybox);
  };

  const handleChangeEventType = (event) => {
    setEventType(event.target.value);
  };

  useEffect(() => {
    if (keyboxParam) setSelectedKeyboxName(keyboxParam);
    getKeyboxesData();
  }, []);

  useEffect(() => {
    if (keyboxesData && keyboxesData.length > 0) {
      if (selectedKeyboxName === "") {
        getKeyboxData(keyboxesData[0].data().keyboxName);
      } else {
        getKeyboxData(selectedKeyboxName);
      }
    }
  }, [keyboxesData, selectedKeyboxName]);

  return (
    <>
      <Typography component="h1" variant="h1" sx={{ fontSize: 50, m: 5 }}>
        Events
      </Typography>
      <Grid container direction="row" my={4} gap={2}>
        {selectedKeyboxData ? (
          <Select
            labelId="selectKeyboxLabel"
            id="selectKeybox"
            value={selectedKeyboxData.keyboxName}
            label="Select your keybox"
            onChange={handleChangeKeybox}
          >
            {keyboxesData.map((keybox, index) => (
              <MenuItem key={index} value={keybox.data().keyboxName}>
                {keybox.data().keyboxName}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Select
            labelId="selectKeyboxLabel"
            id="selectKeybox"
            value=""
            displayEmpty
            label="Select your keybox"
          >
            <MenuItem value="">
              <em>No keybox found</em>
            </MenuItem>
          </Select>
        )}
        <Select defaultValue={eventType} onChange={handleChangeEventType}>
          <MenuItem value="accessEvents">Access Events</MenuItem>
          <MenuItem value="deviceUpdateEvents">Device Update Events</MenuItem>
        </Select>

        <IconButton
          aria-label="refresh keyboxes"
          onClick={() => handleRefreshKeyboxes(selectedKeyboxName)}
        >
          <Refresh />
        </IconButton>
      </Grid>

      {eventType === "accessEvents" ? (
        <GoliothEventsTable keyboxData={selectedKeyboxData} />
      ) : (
        <FirebaseEventsTable keyboxData={selectedKeyboxData} />
      )}
    </>
  );
}

export default Events;
