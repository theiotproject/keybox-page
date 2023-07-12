import React from "react";

import AddBox from "@mui/icons-material/AddBox";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "@mui/material/Switch";

function DeviceCard() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handle = () => {
    setOpen(false);
  };

  return (
    <div>
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: "#FFF",
        height: "18rem",
        border: "1px solid #B6B6BB",
        alignContent: "center",
        m: 2,
      }}
    >
      <CardContent>
        <Typography variant="h1" sx={{ fontSize: 20 }}>
          Office#1
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Card sx={{ width: "100%", p: 0.5, pl: 1.5, mt: 1,boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.20)'}}>
            <Typography sx={{ color: "#5A5A5F", fontSize: "1rem" }}>
              id number
            </Typography>
            <Typography sx={{ color: "primary.main", fontSize: "1.7rem" }}>
              12345
            </Typography>
          </Card>

          <Card sx={{ width: "100%", p: 0.5, pl: 1.5, mt: 1, boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.20)'}}>
            <Typography
              variant="body1"
              sx={{ color: "#5A5A5F", fontSize: "1rem" }}
            >
              status
            </Typography>
            <Typography sx={{ color: "#CA1414", fontSize: "1.7rem" }}>
              offline
            </Typography>
          </Card>
          <Button variant="outlined" onClick={handleClick} sx={{ mt: 3, border: 1.5 }}>
            Edit device
          </Button>
        </Box>
      </CardContent>
    </Card>
    <Dialog open={open} onClose={handle}>
    <DialogTitle>Edit device</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Here you can change the device name or switch it on.
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="deviceName"
        label="Device Name"
        fullWidth
        variant="standard"
        sx={{mt: 2}}
      />
      <FormControlLabel control={<Switch />} label="Switch your Key Box on" sx={{mt: 2}}/>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={handle}>Cancel</Button>
      <Button variant="contained" onClick={handle}>Submit</Button>
    </DialogActions>
  </Dialog>
  </div>
  );
}

export default DeviceCard;
