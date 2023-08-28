import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";

import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";
import showWarning from "src/components/Toasts/ToastWarning";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { addUserEvent } from "src/util/services/addUserEvent";
import { editKeyboxValidationSchema } from "src/util/validation/editKeyboxValidationSchema";

function EditKeyboxDialog({
  open,
  toggleDialog,
  refreshKeyboxesData,
  selectedKeyboxData,
}) {
  const { currentUser } = useAuthProvider();
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editKeyboxValidationSchema),
  });

  const handleEditKeybox = async (data) => {
    setLoading(true);
    const keyboxName = selectedKeyboxData.keyboxName;
    const keyboxRef = selectedKeyboxData.keyboxRef;
    // Back off from sending reqeuest if user haven't changed anything
    if (data.keyboxName == keyboxName) {
      reset();
      setLoading(false);
      toggleDialog(false);
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxesCollectionRef = collection(userDocRef, "keyboxes");

    const isKeyboxNameUniqueQuery = query(
      keyboxesCollectionRef,
      where("keyboxName", "==", data.keyboxName)
    );

    const isKeyboxNameUnique = await getDocs(isKeyboxNameUniqueQuery);

    // Check if isKeyboxNameUnique has any docs (if yes keybox already exists)
    if (isKeyboxNameUnique.docs[0]) {
      showWarning(
        "Error while editing keybox: there is already keybox with this name!)"
      );
      toggleDialog();
      setLoading(false);
      reset();
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
        reset();
        refreshKeyboxesData();
        setLoading(false);
        toggleDialog();
      })
      .catch((error) => {
        showError(
          `Error while updating keybox name, check console for more info`
        );
        reset();
        console.error(error);
        setLoading(false);
        toggleDialog();
      });

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "keybox edited",
      keyboxSnapshot.data().keyboxId,
      "-",
      "-"
    );
  };

  return (
    <>
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit keybox</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle
            sx={{
              fontSize: "30px",
              lineHeight: "30px",
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#121212",
              marginY: "1em",
            }}
          >
            Edit KeyBox
          </DialogTitle>
          <DialogContent>
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
              <DialogActions
                sx={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={toggleDialog}
                  sx={{ padding: ".5em 2em" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ padding: ".5em 2em" }}
                >
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

export default EditKeyboxDialog;
