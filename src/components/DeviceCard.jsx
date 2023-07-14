import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import { yupResolver } from "@hookform/resolvers/yup";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "src/backend/db_config";
import * as yup from "yup";

import ErrorMsg from "./ErrorMsg";

const schema = yup
  .object({
    deviceName: yup.string().required("Device Name field is required"),
  })
  .required();

function DeviceCard({ ...props }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState(null);

  useEffect(() => {
    setDeviceStatus(props.deviceStatus);
  }, [props.deviceStatus]);

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

  const handleEditDevice = async (data) => {
    setLoading(true);
    const keyboxRef = doc(db, "keyboxes", props.docId);

    // Back off from sending reqeuest if user haven't changed anything
    if (
      data.deviceName == props.deviceName &&
      data.deviceStatus == props.deviceStatus
    ) {
      setLoading(false);
      handleDialogToggle(false);
      return;
    }

    const editKeyboxQuery = {
      deviceId: props.deviceId,
      ownerId: props.ownerId,
      deviceName: data.deviceName,
      deviceStatus: data.deviceStatus,
    };

    setDoc(keyboxRef, editKeyboxQuery)
      .catch((error) => {
        return <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
      })
      .finally(() => {
        setLoading(false);
        handleDialogToggle();
      });
  };

  const handleDeleteDevice = async () => {
    setLoading(true);
    const keyboxRef = doc(db, "keyboxes", props.docId);
    await deleteDoc(keyboxRef);
    setLoading(false);
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
            {props.deviceName}
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
            <Card
              sx={{
                width: "100%",
                p: 0.5,
                pl: 1.5,
                mt: 1,
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.20)",
              }}
            >
              <Typography sx={{ color: "#5A5A5F", fontSize: "1rem" }}>
                id number
              </Typography>
              <Typography sx={{ color: "primary.main", fontSize: "1.7rem" }}>
                {props.deviceId}
              </Typography>
            </Card>

            <Card
              sx={{
                width: "100%",
                p: 0.5,
                pl: 1.5,
                mt: 1,
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.20)",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#5A5A5F", fontSize: "1rem" }}
              >
                status
              </Typography>
              <Typography
                sx={{
                  color: props.deviceStatus ? "green" : "#CA1414",
                  fontSize: "1.7rem",
                }}
              >
                {props.deviceStatus ? "online" : "offline"}
              </Typography>
            </Card>
            <Button
              variant="outlined"
              onClick={handleDialogToggle}
              sx={{ mt: 3, border: 1.5 }}
            >
              Edit device
            </Button>
          </Box>
        </CardContent>
      </Card>
      {isLoading ? (
        <Dialog open={isLoading}>
          <DialogTitle>Edit device</DialogTitle>
          <DialogContent sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleDialogToggle}>
          <DialogTitle>Edit device</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can change the device name or switch it on.
            </DialogContentText>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(handleEditDevice)}
            >
              <TextField
                autoFocus
                margin="dense"
                id="deviceName"
                name="deviceName"
                label="Device Name"
                defaultValue={props.deviceName}
                {...register("deviceName")}
                error={!!errors.deviceName}
                helperText={errors.deviceName?.message}
                fullWidth
                variant="standard"
                sx={{ mt: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => {
                      setDeviceStatus(!deviceStatus);
                    }}
                    checked={deviceStatus}
                  />
                }
                label={`Your keybox is ${deviceStatus ? "on" : "off"}`}
                {...register("deviceStatus")}
                sx={{ mt: 2 }}
              />
              <DialogActions>
                <IconButton aria-label="delete" onClick={handleDeleteDevice}>
                  <DeleteIcon />
                </IconButton>
                <Button variant="outlined" onClick={handleDialogToggle}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DeviceCard;
