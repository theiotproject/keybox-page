import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import AddBox from "@mui/icons-material/AddBox";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import ErrorMsg from "../../../components/ErrorMsg";
import showError from "src/components/Toasts/ToastError";
import showWarning from "src/components/Toasts/ToastWarning";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { addNewKeyboxValidationSchema } from "src/util/validation/addNewKeyboxValidationSchema";

function AddNewKeybox() {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { currentUser } = useAuthProvider();

  useEffect(() => {
    reset();
  }, [isLoading]);

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewKeyboxValidationSchema),
  });

  const handleAddNewDevice = async (data) => {
    setLoading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const keyboxCollectionRef = collection(userDocRef, "keyboxes");

    const isDeviceUniqueQuery = query(
      keyboxCollectionRef,
      where("keyboxId", "==", data.keyboxId)
    );

    const isDeviceUnique = await getDocs(isDeviceUniqueQuery);

    // Check if isDeviceUnique has any docs (if yes device already exists)
    if (isDeviceUnique.docs[0]) {
      showWarning("Wystąpił błąd: Jest już taki keybox!");
      setLoading(false);
      return;
    }

    const addKeyboxQuery = {
      keyboxId: data.keyboxId,
      keyboxName: data.keyboxName,
    };

    addDoc(keyboxCollectionRef, addKeyboxQuery)
      .catch((error) => {
        showError("Error while adding new keybox, check console for more info");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        handleDialogToggle();
      });
  };

  return (
    <>
      <Card
        sx={{
          width: 275,
          maxWidth: { sx: "100%", sm: 275 },
          backgroundColor: "#E9E9EF",
          height: "18rem",
          border: "1px solid #B6B6BB",
          m: 2,
        }}
      >
        <CardContent>
          <Typography variant="h1" sx={{ fontSize: 20 }}>
            Add new device
          </Typography>
        </CardContent>
        <CardActions>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <IconButton onClick={handleDialogToggle}>
              <AddBox sx={{ height: "40px", width: "40px" }} />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
      {/* dialog is also a form component */}
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Add new device</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleDialogToggle}>
          <DialogTitle>Add new device</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please, input the device id number <br />
              and choose a name for your new Key Box.
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleAddNewDevice)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="keyboxId"
                name="keyboxId"
                label="Device ID"
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
                label="Device Name"
                type="text"
                fullWidth
                {...register("keyboxName")}
                error={!!errors.keyboxName}
                helperText={errors.keyboxName?.message}
                variant="standard"
              />
              <DialogActions>
                <Button onClick={handleDialogToggle}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AddNewKeybox;
