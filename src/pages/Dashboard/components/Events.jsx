import React, { useEffect, useState } from "react";

import { Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import FirebaseEventsTable from "src/components/FirebaseEventsTable";
import GoliothEventsTable from "src/components/GoliothEventsTable";

import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Events({ setLoading }) {
  const { currentUser } = useAuthProvider();

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
    getKeyboxesData();
  }, []);

  useEffect(() => {
    if (keyboxesData && keyboxesData.length > 0) {
      if (selectedKeyboxName === "") {
        getKeyboxData(keyboxesData[0].data().keyboxName);
        setSelectedKeyboxName(keyboxesData[0].data().keyboxName);
      } else {
        getKeyboxData(selectedKeyboxName);
      }
    }
  }, [keyboxesData, selectedKeyboxName]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          my: 4,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography component="h1" variant="h1" sx={{ fontSize: 44, my: 2 }}>
            Events
          </Typography>
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
        </Box>
        <Button variant="outlined" href={`events/${selectedKeyboxName}`}>
          Show all
        </Button>
      </Box>

      {eventType === "accessEvents" ? (
        <GoliothEventsTable
          keyboxData={selectedKeyboxData}
          disablePagination
          compact
        />
      ) : (
        <FirebaseEventsTable
          keyboxData={selectedKeyboxData}
          disablePagination
          compact
        />
      )}
    </>
  );
}

export default Events;
