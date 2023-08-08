import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";
import KeySlotsTable from "src/pages/Keyboxes/components/KeySlotsTable";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import * as yup from "yup";

const schema = yup
  .object({
    keyboxName: yup.string().required("Device Name field is required"),
  })
  .required();

function Keyboxes() {
  const { currentUser } = useAuthProvider();

  const [open, setOpen] = useState(false);
  const [keyboxesData, setKeyboxesData] = useState();
  const [selectedKeyboxData, setSelectedKeyboxData] = useState();
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  useEffect(() => {
    getKeyboxesData();
  }, []);

  useEffect(() => {
    if (keyboxesData) {
      setSelectedKeyboxData({
        keyboxRef: keyboxesData[0].ref,
        keyboxName: keyboxesData[0].data().keyboxName,
        keyboxId: keyboxesData[0].data().keyboxId,
      });
      getKeyboxData(keyboxesData[0].data().keyboxName);
    }
  }, [keyboxesData]);

  const handleChangeKeybox = (event) => {
    getKeyboxData(event.target.value);
  };

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const handleEditKeybox = async (data) => {
    setLoading(true);
    const keyboxName = selectedKeyboxData.keyboxName;
    const keyboxRef = selectedKeyboxData.keyboxRef;
    // Back off from sending reqeuest if user haven't changed anything
    if (data.keyboxName == keyboxName) {
      setLoading(false);
      handleDialogToggle(false);
      return;
    }

    const editKeyboxQuery = {
      keyboxId: selectedKeyboxData.keyboxId,
      keyboxName: data.keyboxName,
    };

    setDoc(keyboxRef, editKeyboxQuery)
      .then(() => {
        showSuccess(`
          Keybox name updated successfully
        `);
        getKeyboxesData();
        setLoading(false);
        handleDialogToggle();
      })
      .catch((error) => {
        showError(
          `Error while updating keybox name, check console for more info`
        );
        console.error(error);
        setLoading(false);
        handleDialogToggle();
      });
  };
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
        <Button variant="outlined" onClick={handleDialogToggle}>
          Edit Keybox
        </Button>
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
      <KeySlotsTable />
      <Grid
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "2rem",
          alignItems: "center",
        }}
      >
        <Add sx={{ fontSize: "2rem" }} />
        <Typography sx={{ fontSize: "1.5rem" }}>Dodaj nowy</Typography>
      </Grid>

      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit keybox</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleDialogToggle}>
          <DialogTitle>Edit keybox</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can change the device name
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleEditKeybox)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="keyboxName"
                name="keyboxName"
                label="Device Name"
                {...register("keyboxName")}
                error={!!errors.keyboxName}
                helperText={errors.keyboxName?.message}
                fullWidth
                variant="standard"
                sx={{ mt: 2 }}
              />
              <DialogActions>
                <Button variant="outlined" onClick={handleDialogToggle}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default Keyboxes;
