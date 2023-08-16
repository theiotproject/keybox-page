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

import showWarning from "src/components/Toasts/ToastWarning";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { editSlotValidationSchema } from "src/util/validation/editSlotValidationSchema";

function EditKeySlotDialog({
  open,
  toggleDialog,
  refreshKeyboxTable,
  keyboxRef,
  slotId,
  slotName,
}) {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editSlotValidationSchema),
  });

  const handleEditSlot = async (data) => {
    setLoading(true);

    if (data.slotName == slotName) {
      reset();
      setLoading(false);
      toggleDialog(false);
      return;
    }

    const slotsCollectionRef = collection(keyboxRef, "slots");

    const isSlotNameUniqueQuery = query(
      slotsCollectionRef,
      where("slotName", "==", data.slotName)
    );

    const isSlotNameUnique = await getDocs(isSlotNameUniqueQuery);

    // Check if isSlotUnique has any docs (if yes keybox already exists)
    if (isSlotNameUnique.docs[0]) {
      showWarning(
        "Error while editing key slot: there is already key slot with this name!)"
      );
      setLoading(false);
      reset();
      return;
    }

    const editKeyboxSlotQuery = {
      slotName: data.slotName,
    };

    updateDoc(doc(keyboxRef, "slots", slotId), editKeyboxSlotQuery)
      .catch((error) => {
        showError("Error while editing key slot, check console for more info");
        console.error(error);
      })
      .finally(() => {
        reset();
        setLoading(false);
        toggleDialog();
        refreshKeyboxTable();
      });
  };

  const handleDeleteSlot = async () => {
    setLoading(true);
    deleteDoc(doc(keyboxRef, "slots", slotId))
      .catch((error) => {
        showError("Error while deleting key slot, check console for more info");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        refreshKeyboxTable();
        toggleDialog();
      });
  };

  return (
    <>
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit slot</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle>Edit Key Slot</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can change the slot name!
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleEditSlot)}
            >
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
                <IconButton
                  aria-label="delete slot"
                  onClick={() => handleDeleteSlot()}
                >
                  <Delete />
                </IconButton>
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

export default EditKeySlotDialog;