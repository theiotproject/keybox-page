import React from "react";

import AddBox from "@mui/icons-material/AddBox";
import { Button, IconButton, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

function AddNewDevice() {
  const [open, setOpen] = React.useState(false);

  const handleDialogToggle = () => {
    setOpen(!open);
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
            id="device_id"
            label="Device ID"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="device_name"
            label="Device Name"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogToggle}>Cancel</Button>
          <Button onClick={handleDialogToggle}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddNewDevice;
