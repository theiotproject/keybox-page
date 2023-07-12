import React, { useState } from "react";
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
import { addDoc, collection } from "firebase/firestore";
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
  const [isAddBoxLoading, setIsAddBoxLoading] = useState(false);
  const { currentUser } = useAuthProvider();

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleAddNewBox = async (data) => {
    setIsAddBoxLoading(true);
    const keyboxesRef = collection(db, "keyboxes");

    const addKeyboxQuery = {
      boxId: data.deviceId,
      ownerId: currentUser.uid,
      boxName: data.deviceName,
      boxStatus: "offline",
    };

    addDoc(keyboxesRef, addKeyboxQuery)
      .catch((error) => {
        return <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
      })
      .finally(() => {
        setIsAddBoxLoading(false);
        handleDialogToggle();
      });
  };

  return (
    <div>
      <Card sx={{ minWidth: 275, backgroundColor: "#E9E9EF", height: "10rem" }}>
        <CardContent>
          <Typography variant="h1" sx={{ fontSize: 14 }}>
            Add new device
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={handleDialogToggle}>
            <AddBox />
          </IconButton>
        </CardActions>
      </Card>
      {/* dialog is also a form component */}
      {isAddBoxLoading ? (
        <Dialog open={isAddBoxLoading}>
          <DialogTitle>Add new device</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleDialogToggle}>
          <DialogTitle>Add new device</DialogTitle>
          <DialogContent>
            <DialogContentText>This works !!!!</DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleAddNewBox)}
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
    </div>
  );
}

export default AddNewDevice;
