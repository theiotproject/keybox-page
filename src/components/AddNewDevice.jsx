import React from "react";

import AddBox from "@mui/icons-material/AddBox";
import { Button, IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Card
        sx={{
          minWidth: 275,
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
            <IconButton onClick={handleClickOpen}>
              <AddBox
                sx={{ height: "40px", width: "40px" }}
              />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, input the device id number <br /> 
            and choose a name for your
            new Key Box.
          </DialogContentText>
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
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddNewDevice;
