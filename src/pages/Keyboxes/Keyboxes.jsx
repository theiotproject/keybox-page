import React, { useEffect, useState } from "react";

import { Refresh } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";

import EditKeyboxDialog from "./components/EditKeyboxDialog";
import KeySlotsTable from "src/pages/Keyboxes/components/KeySlotsTable";

import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function Keyboxes() {
  const { currentUser } = useAuthProvider();

  const [keyboxesData, setKeyboxesData] = useState();
  const [selectedKeyboxData, setSelectedKeyboxData] = useState();

  const [editKeyboxDialogOpen, setEditKeyboxDialogOpen] = useState(false);

  const toggleEditKeyboxDialog = () => {
    setEditKeyboxDialogOpen(!editKeyboxDialogOpen);
  };

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
  };

  const handleRefreshKeyboxes = () => {
    getKeyboxesData();
  };

  useEffect(() => {
    getKeyboxesData();
  }, []);

  useEffect(() => {
    if (keyboxesData) {
      getKeyboxData(keyboxesData[0].data().keyboxName);
    }
  }, [keyboxesData]);

  return (
    <>
      <Typography variant="h1" my={4}>
        Manage your KeyBox
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
          <Skeleton animation="wave" width={"6ch"} />
        )}
        <Button variant="outlined" onClick={toggleEditKeyboxDialog}>
          Edit Keybox
        </Button>
        <IconButton
          aria-label="refresh keyboxes"
          onClick={() => handleRefreshKeyboxes()}
        >
          <Refresh />
        </IconButton>
      </Grid>

      <Typography
        sx={{
          color: "secondary.contrastTextVariant",
          fontSize: "2rem",
          paddingRight: "1rem",
          marginBottom: 3,
        }}
      >
        KeySlots:
      </Typography>
      {selectedKeyboxData && (
        <KeySlotsTable keyboxRef={selectedKeyboxData.keyboxRef} />
      )}

      <EditKeyboxDialog
        open={editKeyboxDialogOpen}
        toggleDialog={toggleEditKeyboxDialog}
        refreshKeyboxesData={getKeyboxesData}
        selectedKeyboxData={selectedKeyboxData}
      />
    </>
  );
}

export default Keyboxes;
