import React from "react";
import { IconButton, Typography } from "@mui/material";
import AddBox from '@mui/icons-material/AddBox';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

function AddNewDevice() {

    return (
    <Card sx={{ minWidth: 275 }}>
    <CardContent>
    <Typography variant="h1" sx={{ fontSize: 14 }}>
        Add new device
    </Typography>
    </CardContent>
    <CardActions>
    <IconButton aria-label="add" disabled color="primary" size="large">
    <AddBox />
    </IconButton>
    </CardActions>
    </Card>
    );
  }
  
  export default AddNewDevice;
  