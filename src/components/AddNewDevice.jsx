import React, { useState } from "react";

import AddBox from "@mui/icons-material/AddBox";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

function AddNewDevice() {
  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const { currentUser } = useAuthProvider();

  const handleDialogToggle = () => {
    setOpen(!open);
  };

  const handleDialogSubmit = async (event) => {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // console.log(data.get("deviceId"), data.get("deviceName"), currentUser.uid);
    console.log(deviceId, deviceName);
    try {
      console.log("hej1");
      await addDoc(collection(db, "keyboxes"), {
        boxId: deviceId,
        ownerId: "test",
        boxName: deviceName,
        boxStatus: "offline",
      });
    } catch (e) {
      console.error(e);
    } finally {
      console.log("hej2");
    }
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
      <Dialog open={open} onClose={handleDialogToggle}>
        <DialogTitle>Add new device</DialogTitle>
        <DialogContent>
          <DialogContentText>This works !!!!</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="deviceId"
            name="deviceId"
            label="Device ID"
            type="email"
            fullWidth
            onChange={(e) => setDeviceId(e.currentTarget.value)}
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="deviceName"
            name="deviceName"
            label="Device Name"
            type="email"
            fullWidth
            onChange={(e) => setDeviceName(e.currentTarget.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogToggle}>Cancel</Button>
          <Button onClick={handleDialogSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddNewDevice;
