import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import showError from "src/components/Toasts/ToastError";
import showWarning from "src/components/Toasts/ToastWarning";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { addUserEvent } from "src/util/services/addUserEvent";
import { addNewSlotValidationSchema } from "src/util/validation/addNewSlotValidationSchema";

function AddNewKeySlotDialog({
  open,
  toggleDialog,
  refreshKeyboxTable,
  keyboxRef,
}) {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewSlotValidationSchema),
  });

  const handleAddNewSlot = async (data) => {
    setLoading(true);
    const slotsCollectionRef = collection(keyboxRef, "slots");

    const isSlotIdUniqueQuery = query(
      slotsCollectionRef,
      where(documentId(), "==", data.slotId)
    );

    const isSlotNameUniqueQuery = query(
      slotsCollectionRef,
      where("slotName", "==", data.slotName)
    );

    const isSlotIdUnique = await getDocs(isSlotIdUniqueQuery);
    const isSlotNameUnique = await getDocs(isSlotNameUniqueQuery);

    // Check if isSlotUnique has any docs (if yes keybox already exists)
    if (isSlotIdUnique.docs[0] || isSlotNameUnique.docs[0]) {
      showWarning("There is already this key slot (name or id is repeating)");
      setLoading(false);
      reset();
      return;
    }

    const addKeyboxSlotQuery = {
      slotName: data.slotName,
      authorizedCards: [],
    };

    await setDoc(doc(keyboxRef, "slots", data.slotId), addKeyboxSlotQuery)
      .catch((error) => {
        showError("Error while adding new keybox, check console for more info");
        console.error(error);
      })
      .finally(() => {
        reset();
        setLoading(false);
        toggleDialog();
        refreshKeyboxTable();
      });

    const keyboxSnapshot = await getDoc(keyboxRef);

    // send log to keybox Events
    addUserEvent(
      keyboxRef,
      "new key slot",
      keyboxSnapshot.data().keyboxId,
      data.slotId,
      "-"
    );
  };

  return (
    <>
      {/* Add new slot dialog */}
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Add new slot</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle>Add new Key Slot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please, input the slot id number <br />
              and choose a name for your new Key Slot.
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleAddNewSlot)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="slotId"
                name="slotId"
                label="Slot ID"
                type="text"
                fullWidth
                {...register("slotId")}
                error={!!errors.slotId}
                helperText={errors.slotId?.message}
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="slotName"
                name="slotName"
                label="Slot Name"
                type="text"
                fullWidth
                {...register("slotName")}
                error={!!errors.slotName}
                helperText={errors.slotName?.message}
                variant="standard"
              />
              <DialogActions>
                <Button onClick={toggleDialog}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AddNewKeySlotDialog;
