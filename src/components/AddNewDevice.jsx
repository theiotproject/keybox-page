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

import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import * as yup from "yup";

import ErrorMsg from "./ErrorMsg";

const schema = yup
  .object({
    deviceId: yup.string().required("Device ID field is required"),
    deviceName: yup.string().required("Device Name field is required"),
  })
  .required();

function AddNewDevice() {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { currentUser } = useAuthProvider();

  useEffect(() => {
    reset({
      data: "",
    });
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
    resolver: yupResolver(schema),
  });

  const handleAddNewDevice = async (data) => {
    setLoading(true);
    const keyboxesRef = collection(db, "keyboxes");

    const isDeviceUniqueQuery = query(
      keyboxesRef,
      where("deviceId", "==", data.deviceId)
    );

    const isDeviceUnique = await getDocs(isDeviceUniqueQuery);

    // Check if isDeviceUnique has any docs (if yes device already exists)
    if (isDeviceUnique.docs[0]) {
      alert("Wystąpił błąd: Jest już taki keybox!");
      setLoading(false);
      return;
    }

    const addKeyboxQuery = {
      deviceId: data.deviceId,
      ownerId: currentUser.uid,
      deviceName: data.deviceName,
      deviceStatus: false,
    };

    addDoc(keyboxesRef, addKeyboxQuery)
      .catch((error) => {
        return <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
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
                id="deviceId"
                name="deviceId"
                label="Device ID"
                type="text"
                fullWidth
                {...register("deviceId")}
                error={!!errors.deviceId}
                helperText={errors.deviceId?.message}
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="deviceName"
                name="deviceName"
                label="Device Name"
                type="text"
                fullWidth
                {...register("deviceName")}
                error={!!errors.deviceName}
                helperText={errors.deviceName?.message}
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

export default AddNewDevice;
