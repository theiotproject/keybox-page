import { useState } from "react";
import { useForm } from "react-hook-form";

import { Add, GridViewOutlined } from "@mui/icons-material";
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
  Typography,
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
  setDoc,
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

    const addKeyboxData = {
      keyboxId: data.keyboxId,
      keyboxName: data.keyboxName,
    };

    const keyboxRef = await addDoc(keyboxCollectionRef, addKeyboxData).catch(
      (error) => {
        showError("Error while adding new keybox, check console for more info");
        console.error(error);
      }
    );

    await setDoc(doc(keyboxRef, "slots", "1"), {
      slotName: data.keySlotName1 ? data.keySlotName1 : "KeySlot #1",
      authorizedCards: [],
    });

    await setDoc(doc(keyboxRef, "slots", "2"), {
      slotName: data.keySlotName2 ? data.keySlotName2 : "KeySlot #2",
      authorizedCards: [],
    });

    await setDoc(doc(keyboxRef, "slots", "3"), {
      slotName: data.keySlotName3 ? data.keySlotName3 : "KeySlot #3",
      authorizedCards: [],
    }).finally(() => {
      refreshKeyboxesData();
      reset();
      setLoading(false);
      toggleDialog();
    });

    // send log to keybox Events
    addUserEvent(keyboxRef, "new keybox", data.keyboxId, "-", "-");
    addUserEvent(keyboxRef, "new key slot", data.keyboxId, 1, "-");
    addUserEvent(keyboxRef, "new key slot", data.keyboxId, 2, "-");
    addUserEvent(keyboxRef, "new key slot", data.keyboxId, 3, "-");
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
        <Dialog
          open={open}
          onClose={() => {
            toggleDialog();
            reset();
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "30px",
              lineHeight: "30px",
              fontWeight: "bold",
              fontFamily: "Poppins",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "gray",
              marginY: "1em",
            }}
          >
            Add new KeyBox
          </DialogTitle>
          <DialogContent>
            <Box
              component="form"
              noValidate
              sx={{
                display: "grid",
                placeItems: "center",
                rowGap: "1em",
                paddingX: "1.75em",
              }}
              onSubmit={handleSubmit(handleAddNewKeybox)}
            >
              <TextField
                autoFocus
                id="keyboxId"
                name="keyboxId"
                label={
                  <div>
                    KeyBox Id{" "}
                    <Typography component="small" sx={{ fontSize: "12px" }}>
                      *provided by the team
                    </Typography>
                  </div>
                }
                {...register("keyboxId")}
                error={!!errors.keyboxId}
                helperText={errors.keyboxId?.message}
                fullWidth
                variant="standard"
              />
              <TextField
                id="keyboxName"
                name="keyboxName"
                label="KeyBox Name"
                {...register("keyboxName")}
                error={!!errors.keyboxName}
                helperText={errors.keyboxName?.message}
                fullWidth
                variant="standard"
              />

              <Typography
                sx={{
                  fontSize: "20px",
                  lineHeight: "30px",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "gray",
                  marginTop: "70px",
                }}
              >
                KeySlot Names
              </Typography>
              <TextField
                id="keySlotName1"
                name="keySlotName1"
                label="KeySlotName #1"
                {...register("keySlotName1")}
                error={!!errors.keySlotName1}
                helperText={errors.keySlotName1?.message}
                fullWidth
                variant="standard"
              />
              <TextField
                id="keySlotName2"
                name="keySlotName2"
                label="KeySlotName #2"
                {...register("keySlotName2")}
                error={!!errors.keySlotName2}
                helperText={errors.keySlotName2?.message}
                fullWidth
                variant="standard"
              />
              <TextField
                id="keySlotName3"
                name="keySlotName3"
                label="KeySlotName #3"
                {...register("keySlotName3")}
                error={!!errors.keySlotName3}
                helperText={errors.keySlotName3?.message}
                fullWidth
                variant="standard"
              />
              <DialogActions sx={{ marginTop: "1em", gap: ".75em" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    toggleDialog();
                    reset();
                  }}
                  sx={{
                    padding: ".5em 2em",
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  sx={{ padding: ".5em 2em" }}
                  type="submit"
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

export default AddNewKeyboxDialog;
