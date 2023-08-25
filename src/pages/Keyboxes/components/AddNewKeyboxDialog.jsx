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
          <DialogTitle
            sx={{
              fontSize: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Add new KeyBox
            <
          </DialogTitle>
          <DialogContent
            sx={{
              marginX: { xs: "unset", sm: "4em" },
            }}
          >
            <Box
              component="form"
              noValidate
              sx={{
                display: "grid",
                placeItems: "center",
              }}
              onSubmit={handleSubmit(handleEditCard)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="cardId"
                name="cardId"
                label="Card Id"
                defaultValue={cardData.id}
                {...register("cardId")}
                error={!!errors.cardId}
                helperText={errors.cardId?.message}
                fullWidth
                variant="outlined"
                sx={{ mt: 2, width: "100%" }}
                disabled
              />
              <TextField
                autoFocus
                margin="dense"
                id="cardName"
                name="cardName"
                label="Card Name"
                defaultValue={cardData.data().cardName}
                {...register("cardName")}
                error={!!errors.cardName}
                helperText={errors.cardName?.message}
                fullWidth
                variant="outlined"
                sx={{ mt: 2, width: "100%" }}
              />

              <CustomFormSelect
                selectedValue={cardData.data().group}
                setSelectedGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              />

              <TextField
                id="authorizedSlots"
                name="authorizedSlots"
                label="Authorized Slots"
                {...register("authorizedSlots")}
                error={!!errors.authorizedSlots}
                helperText={errors.authorizedSlots?.message}
                variant="outlined"
                sx={{ mt: 2 }}
                fullWidth
              />
              <em>Comma seperated</em>

              <DialogActions
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  columnGap: ".5em",
                }}
                disableSpacing
              >
                <Button
                  aria-label="delete"
                  color="error"
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                  onClick={() => handleDeleteCard(cardData.id)}
                >
                  <Delete />
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: "100%", marginY: "2em" }}
                  startIcon={<Add />}
                  type="submit"
                >
                  Add Card
                </Button>

                <Button
                  variant="outlined"
                  onClick={toggleDialog}
                  sx={{
                    gridColumn: { sm: "1/-1" },
                    width: "100%",
                  }}
                >
                  Close
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
