import { useState } from "react";
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
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { addUserEvent } from "src/util/services/addUserEvent";
import { addNewKeyboxValidationSchema } from "src/util/validation/addNewKeyboxValidationSchema";

function AddNewKeyboxDialog({ open, toggleDialog, refreshKeyboxesData }) {
  const { currentUser } = useAuthProvider();

  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewKeyboxValidationSchema),
  });

  const handleAddNewKeybox = async (data) => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxCollectionRef = collection(userDocRef, "keyboxes");

    const isKeyboxIdUniqueQuery = query(
      keyboxCollectionRef,
      where("keyboxId", "==", data.keyboxId)
    );

    const isKeyboxNameUniqueQuery = query(
      keyboxCollectionRef,
      where("keyboxName", "==", data.keyboxName)
    );

    const isKeyboxIdUnique = await getDocs(isKeyboxIdUniqueQuery);
    const isKeyboxNameUnique = await getDocs(isKeyboxNameUniqueQuery);

    // Check if isKeyboxUnique has any docs (if so, keybox already exists)
    if (isKeyboxIdUnique.docs[0] || isKeyboxNameUnique.docs[0]) {
      showWarning("Error there is already keybox with this name or id");
      setLoading(false);
      return;
    }

    const addKeyboxQuery = {
      keyboxId: data.keyboxId,
      keyboxName: data.keyboxName,
    };

    const keyboxRef = await addDoc(keyboxCollectionRef, addKeyboxQuery)
      .catch((error) => {
        showError("Error while adding new keybox, check console for more info");
        console.error(error);
      })
      .finally(() => {
        refreshKeyboxesData();
        reset();
        setLoading(false);
        toggleDialog();
      });

    // send log to keybox Events
    addUserEvent(keyboxRef, "new keybox", data.keyboxId, "-", "-");
  };

  return (
    <>
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Add new keybox</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle>Add new keybox</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please, input the keybox id number <br />
              and choose a name for your new Key Box.
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleAddNewKeybox)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="keyboxId"
                name="keyboxId"
                label="Keybox ID"
                type="text"
                fullWidth
                {...register("keyboxId")}
                error={!!errors.keyboxId}
                helperText={errors.keyboxId?.message}
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="keyboxName"
                name="keyboxName"
                label="Keybox Name"
                type="text"
                fullWidth
                {...register("keyboxName")}
                error={!!errors.keyboxName}
                helperText={errors.keyboxName?.message}
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

export default AddNewKeyboxDialog;
