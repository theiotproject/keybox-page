import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Add, Delete, Refresh } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";

import AddNewKeyboxDialog from "./components/AddNewKeyboxDialog";
import EditKeyboxDialog from "./components/EditKeyboxDialog";
import showError from "src/components/Toasts/ToastError";
import KeySlotsTable from "src/pages/Keyboxes/components/KeySlotsTable";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { deleteKeyboxInGolioth } from "src/util/services/deleteKeyboxInGolioth";

function Keyboxes() {
  const { currentUser } = useAuthProvider();

  const { keyboxParam } = useParams();

  const [keyboxesData, setKeyboxesData] = useState();
  const [selectedKeyboxData, setSelectedKeyboxData] = useState();
  const [selectedKeyboxName, setSelectedKeyboxName] = useState("");

  const [editKeyboxDialogOpen, setEditKeyboxDialogOpen] = useState(false);

  const [newKeyboxDialogOpen, setNewKeyboxDialogOpen] = useState(false);

  const toggleEditKeyboxDialog = () => {
    setEditKeyboxDialogOpen(!editKeyboxDialogOpen);
  };

  const toggleAddNewKeyboxDialog = () => {
    setNewKeyboxDialogOpen(!newKeyboxDialogOpen);
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
    setSelectedKeyboxName(event.target.value);
  };

  const handleRefreshKeyboxes = (lastSelectedKeybox) => {
    setSelectedKeyboxName(lastSelectedKeybox);
    getKeyboxesData(lastSelectedKeybox);
  };

  const deleteSelectedKeybox = async (keyboxRef) => {
    await deleteDoc(keyboxRef)
      .then(async () => {
        await deleteKeyboxInGolioth(selectedKeyboxData.keyboxId);
      })
      .catch((error) => {
        showError(
          "Erorr while deleting selected keybox, check console for more info"
        );
        console.error(error);
      })
      .finally(() => {
        setSelectedKeyboxName("");
        getKeyboxesData();
      });
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
      <Typography variant="h1" my={4}>
        Manage your KeyBox
      </Typography>

      <Grid container columnSpacing={2} my={4} alignItems={"center"}>
        <Grid item>
          <IconButton
            aria-label="add new keybox"
            onClick={() => toggleAddNewKeyboxDialog()}
          >
            <Add />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="delete selected keybox"
            onClick={() => {
              deleteSelectedKeybox(selectedKeyboxData.keyboxRef);
            }}
            disabled={keyboxesData && !keyboxesData.length > 0}
          >
            <Delete />
          </IconButton>
        </Grid>
        <Grid item>
          {keyboxesData && keyboxesData.length > 0 && selectedKeyboxData ? (
            <Select
              labelId="selectKeyboxLabel"
              id="selectKeybox"
              value={selectedKeyboxData.keyboxName}
              label="Select your keybox"
              sx={{
                "& legend": { display: "none" },
                "& fieldset": { top: 0 },
              }}
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
              sx={{
                "& legend": { display: "none" },
                "& fieldset": { top: 0 },
              }}
              displayEmpty
              label="Select your keybox"
            >
              <MenuItem value="">
                <em>No keybox found</em>
              </MenuItem>
            </Select>
          )}
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={toggleEditKeyboxDialog}>
            Edit Keybox
          </Button>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="refresh keyboxes"
            onClick={() => handleRefreshKeyboxes(selectedKeyboxName)}
          >
            <Refresh />
          </IconButton>
        </Grid>
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
      {keyboxesData && keyboxesData.length > 0 && selectedKeyboxData && (
        <KeySlotsTable keyboxRef={selectedKeyboxData.keyboxRef} />
      )}

      <AddNewKeyboxDialog
        open={newKeyboxDialogOpen}
        toggleDialog={toggleAddNewKeyboxDialog}
        refreshKeyboxesData={getKeyboxesData}
        setSelectedKeyboxName={setSelectedKeyboxName}
      />

      <EditKeyboxDialog
        open={editKeyboxDialogOpen}
        toggleDialog={toggleEditKeyboxDialog}
        refreshKeyboxesData={getKeyboxesData}
        selectedKeyboxData={selectedKeyboxData}
        setSelectedKeyboxName={setSelectedKeyboxName}
        getKeyboxData={getKeyboxData}
      />
    </>
  );
}

export default Keyboxes;
